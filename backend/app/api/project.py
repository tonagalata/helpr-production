from os import stat
from fastapi import APIRouter, Depends, HTTPException, requests, Body, status
from app.auth.jwt_handler import get_current_user
from app.core.validation import check_unique, set_key_number
from app.database.models.project import Project, ProjectUpdate
from pyArango.theExceptions import DocumentNotFoundError

from typing import Union

from app.database.collection import (
    db, project_collection, user_collection, cohort_collection
)


router = APIRouter(prefix="/project")


@router.get("/all", tags=['Project'])
async def get_all_projects():
    d = project_collection.fetchByExample({}, batchSize=100)
    return [project.getStore() for project in d]

@router.get('/{project_key}', tags=['Project'])
async def get_one_project(project_key: str):
    try:
        doc = project_collection[project_key]
    except DocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with key '{project_key}' not found. Try search in project/all."
        )
    
    return doc.getStore()

@router.post("/create", tags=['Project'])
async def create_project(project: Project = Body(default=None), apiKey: dict=Depends(get_current_user)):

    if not check_unique(project_collection, project.github_repo.lower(), "github_repo"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with repo '{project.github_repo}' already exists"
        )
    
    doc = project_collection.createDocument()
    doc.set(project.dict())

    doc['github_repo'] = project.github_repo.lower()
    doc['_key'] = set_key_number(project_collection, project.github_repo.split('/')[-1])
    
    doc.save()

    return {"post": doc.getStore(), "project_key": doc['_key']}

# TODO update project


# TODO assign project to cohort

# TODO get project members

# TODO add project members

# TODO remove project members


@router.delete("/delete/{project_key}", tags=['Project'])
async def delete_project(project_key: str):
    try:
        doc = project_collection[project_key]
    except DocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No project found with key '{project_key}'."
        )
    dict_doc = doc.getStore()
    doc.delete()

    return {
        "status_code": status.HTTP_200_OK,
        "removed_project": dict_doc
        }
