from fastapi import APIRouter, Depends, HTTPException, Body, status, requests
from app.database.models.user import User, UserUpdate
from app.auth.pass_validation import get_user, hash_password
from app.auth.jwt_handler import get_current_user
from app.core.validation import check_unique

from typing import Union
from pydantic import EmailStr

from app.database.collection import (
    user_collection, cohort_collection, project_collection, db
)

router = APIRouter(prefix='/user')

# Setting user print keys
def parse_user_dict(user: dict, _key: bool=False) -> dict:
    print_keys = ['username', 'first_name', 'last_name', 'email']

    if _key:
        print_keys.append('_key')

    return {key: user[key] for key in print_keys}

# Get a user
@router.get("/{username}/info", tags=['User'])
async def get_one_user(username: str):
    user = get_user(user_collection, username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username {} exists.".format(username)
        )

    return user

# Search users
@router.get("/search", tags=['User'])
async def search_users(
    first_name: Union[str, None] = None,
    last_name: Union[str, None] = None,
    username: Union[str, None] = None,
    email: Union[EmailStr, None] = None
):
    
    search = {}
    if first_name:
        search['first_name'] = first_name.title().strip()
    if last_name:
        search['last_name'] = last_name.title().strip()
    if username:
        search['username'] = username.lower().replace(" ", "")
    if email:
        search['email'] = email.lower().replace(" ", "")

    results = user_collection.fetchByExample(search, batchSize=20, count=True)
    if results.count == 0:
        all_users = []
    else:
        all_users = [doc.getStore() for doc in results]

    return {"user_count": results.count, "users": all_users}

# Create new user
@router.post("/signup", tags=['User'])
async def user_signup(user: User = Body(default=None), password: str = None):

    if get_user(user_collection, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username {} exists.".format(user.username)
        )
    
    if not check_unique(user_collection, user.email, "email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with email {} exists.".format(user.email)
        )

    doc = user_collection.createDocument()
    user_d = user.dict()

    doc['email'] = user_d['email'].lower().replace(" ", "")
    doc['first_name'] = user_d['first_name'].title()
    doc['last_name'] = user_d['last_name'].title()
    doc['username'] = user_d['username'].lower().replace(" ","")

    doc['_key'] = user_d['username'].lower().replace(" ", "")

    doc['password'] = hash_password(password)
    doc.save()

    return doc.getStore()

@router.put("/update-password", tags=['User'])
async def update_user(username: str, password: str, apiKey: dict=Depends(get_current_user)):
    
    user = get_user(user_collection, username)

    # Getting only required user fields
    user = parse_user_dict(user, _key=True)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username '{}' does not exists.".format(username)
        )

    new_password = hash_password(password)

    doc = user_collection[user['_key']]

    doc['password'] = new_password
    doc.save()

    return {
        "status_code": status.HTTP_202_ACCEPTED,
        "message": "Password updated successfully",
        "user": user['_key']
    }

@router.delete("/delete", tags=['User'])
async def user_delete(username: str):

    user = get_user(user_collection, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username '{}' does not exists.".format(username)
        )

    doc = user_collection[user['_key']]

    doc.delete()

    return {
        "status_code": status.HTTP_200_OK,
        "deleted_user": parse_user_dict(user)
        }
