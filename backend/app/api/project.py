from os import stat
from fastapi import APIRouter, Depends, HTTPException, requests, Body, status
from app.auth.jwt_handler import get_current_user
from app.auth.pass_validation import get_user
from app.core.validation import check_unique, set_key_number
from app.database.models.project import Project, ProjectMember, ProjectUpdate
from pyArango.theExceptions import DocumentNotFoundError

from typing import Union, List

from app.database.collection import (
    hub_graph, memberOf_edge
)

project_collection = hub_graph.vertex_collection("project")
user_collection = hub_graph.vertex_collection("user")

router = APIRouter(prefix="/project")


@router.get("/all", tags=['Project'])
async def get_all_projects():
    d = project_collection.all()
    return [project for project in d]

@router.get('/{project_key}', tags=['Project'])
async def get_one_project(project_key: str):
    
    doc = project_collection.get(project_key)
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with key '{project_key}' not found. Try search in project/all."
        )
    
    return doc

@router.post("/create", tags=['Project'])
async def create_project(project: Project = Body(default=None), apiKey: dict=Depends(get_current_user)):

    if not check_unique(project_collection, project.github_repo.lower(), "github_repo"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with repo '{project.github_repo}' already exists"
        )
    
    
    doc = project.dict()

    doc['github_repo'] = project.github_repo.lower()
    doc['_key'] = set_key_number(project_collection, project.github_repo.split('/')[-1])
    
    project_collection.insert(doc)

    return {"post": doc, "project_key": doc['_key']}

# TODO update project


# TODO assign project to cohort

# TODO add project members
@router.post("/members/add", tags=['Project'])
async def add_project_members(body: ProjectMember, apiKey: dict=Depends(get_current_user)):
    users_added = []
    users_failed = []
    users_updated = []
    
    project = project_collection.get(body.project_key)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project with key '{}' not found.".format(body.project_key)
        )
    
    for username in body.username:
        user = get_user(user_collection, username, doc_return=True)
        if user is None:
            users_failed.append(username)
        else:
            
            key = f"{username}-{project['_key']}"
            edge = {
                "_from": user['_id'],
                "_to": project['_id'],
                "_key": key,
                "role": body.role
            }

            edges = memberOf_edge.get(key)
            if edges is None:
                memberOf_edge.insert(edge, silent=True)
                users_added.append(username)
            else:
                memberOf_edge.update(edge, silent=True)
                users_updated.append(username)
    
    return {
        "project": body.project_key,
        "users" : {
            "added": users_added,
            "failed": users_failed,
            "updated": users_updated
        }
    }

# TODO get project members
@router.get("/members/{project_key}", tags=['Project'])
async def get_all_members(project_key: str):

    return [x for x in memberOf_edge.get_many({"_to": project_key})]

# TODO remove project members


@router.delete("/delete/{project_key}", tags=['Project'])
async def delete_project(project_key: str):
    
    doc = project_collection.get(project_key)
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No project found with key '{project_key}'."
        )
    
    project_collection.delete(doc)

    return {
        "status_code": status.HTTP_200_OK,
        "removed_project": doc
        }
