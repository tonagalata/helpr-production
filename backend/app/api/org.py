from fastapi import APIRouter, HTTPException, Depends, status
from app.core.validation import check_unique
from app.auth.jwt_handler import get_current_user

from app.database.models.cohort import Cohort, CohortProject, CohortUpdate, CohortUsers
from app.database.models.university import CohortUniLink, University, UniversityUpdate

from app.database.collection import (
    hub_graph, memberOf_edge, sponsoredBy_edge, createdFor_edge, db
)
from backend.app.auth.pass_validation import get_user

cohort_collection = hub_graph.vertex_collection("cohort")
university_collection = hub_graph.vertex_collection("university")
user_collection = hub_graph.vertex_collection("user")
project_collection = hub_graph.vertex_collection('project')

router = APIRouter(prefix="/org")


@router.get("/cohort/all", tags=['Cohort'])
async def get_cohorts():
    results = cohort_collection.all()

    if results.count() == 0:
        return []
    
    return [x for x in results]


@router.post("/cohort/create", tags=['Cohort'])
async def create_cohort(body: Cohort, apiKey: dict=Depends(get_current_user)):
    results = cohort_collection.find({
        'name': body.name,
        'start_date': body.start_date
    })

    if results.count() != 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": "Cohort with that name and start date already exists.",
                "cohort": results.next()
            }
        )

    body['_key'] = body['name'].lower().strip().replace(" ","")
    
    insertion = cohort_collection.insert(body, return_new=True)
    
    return insertion


@router.get('/cohort/project/get-all', tags=['Cohort'])
async def get_cohort_projects(
    cohort_key: str
):
    query = f"""
    FOR v, e in 1..1 INBOUND 'cohort/{cohort_key}' createdFor
    RETURN v
    """
    results = db.aql.execute(query, count=True)

    if results.count() == 0:
        return []
    return [project for project in results]
    

@router.post("/cohort/user/add", tags=['Cohort'])
async def add_linked_user(
    body: CohortUsers,
    apiKey: dict=Depends(get_current_user)
):
    linked = []
    updated_links = []
    user_not_found = [] 

    new_edges = []
    updates = []

    cohort = cohort_collection.get(body.cohort_key)
    if cohort is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cohort with key '{body.cohort_key}' not found."
        )
    for username in body.users:
        user = get_user(user_collection, username)
        if user is None:
            user_not_found.append(username)
            continue
        
        key = f"{username}-{cohort['_key']}"

        edge = {
            "_from": user['_id'],
            "_to": cohort['_id'],
            "_key": key,
            "role": body.role
        }

        edges = memberOf_edge.get(key)
        if edges is None:
            new_edges.append(edge)
            linked.append(username)
        else:
            updates.append(edge)
            updated_links.append(edge)
    
    new_edge = memberOf_edge.insert_many(new_edges, return_new=True)
    update_edge = memberOf_edge.update_many(updates, keep_none=False, return_new=True)
        
    return {
        "new_users": {
            "edges": new_edge,
            "users": linked,
        },
        "updated_users": {
            "edges": update_edge,
            "users": updated_links,
        },
        "errors": {
            "users-not-found": user_not_found,
        },
    }


@router.delete("/cohort/user/remove", tags=['Cohort'])
async def remove_linked_user(
    username: str,
    cohort_key: str,
    apiKey: dict=Depends(get_current_user)
):
    key = f"{username}-{cohort_key}"

    edge = memberOf_edge.get(key)
    if edge is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No link exists between user: '{username}' and cohort: '{cohort_key}'"
        )
    memberOf_edge.delete(key)
    
    return {
        "status_code": status.HTTP_200_OK,
        "message": {
            "detail": "Edge deleted successfully",
            "edge": edge
        } 
    }


@router.get("/university/all", tags=['University'])
async def get_universities():
    results = university_collection.all()

    if results.count() == 0:
        return []
    
    return [uni for uni in results]


@router.post("/university/create", tags=['University'])
async def create_university(body: University, apiKey: dict=Depends(get_current_user)):
    results = university_collection.get(body.abbreviation.strip())
    if results.count() != 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "message": f"{body.abbreviation} already exists in DB.",
                "university": [x for x in results]
            }
        )
    
    university = body.dict()
    university['_key'] = body.abbreviation.strip()

    uni = university_collection.insert(university, return_new=True)
    return uni


@router.post("/university/cohort/add", tags=['Cohort', 'University'])
async def link_cohort_university(body: CohortUniLink, apiKey: dict=Depends(get_current_user)):
    cohort = cohort_collection.get(body.cohort_key)
    university = university_collection.get(body.university_abbv)

    if cohort is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cohort {body.cohort_key} does not exist"
        )
    if university is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"University '{body.university_abbv}' does not exist"
        )
    key = f"{body.cohort_key}-{body.university_abbv}"
    
    edge = {
        '_from': cohort['_id'],
        '_to': university['_id'],
        '_key': key
    }

    edges = sponsoredBy_edge.get(key)
    
    if edges is None:
        new_edge = sponsoredBy_edge.insert(edge, return_new=True)
    else:
        new_edge = sponsoredBy_edge.update(edge, keep_none=False, return_new=True)
    
    return new_edge


@router.post("/cohort/project/add", tags=['Project'])
async def link_project_cohort(body: CohortProject, apiKey: dict=Depends(get_current_user)):
    project = project_collection.get(body.project_key)
    cohort = cohort_collection.get(body.cohort_key)

    if cohort is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cohort {body.cohort_key} does not exist"
        )
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {body.project_key} does not exist"
        )
    
    key = f"{body.project_key}-{body.cohort_key}"
    
    edge = {
        '_from': cohort['_id'],
        '_to': project['_id'],
        '_key': key
    }

    edges = createdFor_edge.get(key)
    if edges is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project {body.project_key} is already linked to {body.cohort_key}"
        )
    
    new_edge = createdFor_edge.insert(edge, return_new=True)

    return new_edge
