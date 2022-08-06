from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, Body, status, requests
from app.database.models.user import User, UserFunding, UserUpdate, RoleEnum
from app.auth.pass_validation import get_user, hash_password
from app.auth.jwt_handler import get_current_user
from app.core.validation import check_unique

from typing import Union
from pydantic import EmailStr



from app.database.collection import (
    hub_graph, db
)

user_collection = hub_graph.vertex_collection("user")

router = APIRouter(prefix='/user')

# Setting user print keys
def parse_user_dict(user: dict, _key: bool=False) -> dict:
    print_keys = ['username', 'first_name', 'last_name', 'email', 'image_path']

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
            detail="User with username {} does not exist.".format(username)
        )

    return user

# Search users
@router.get("/search", tags=['User'])
async def search_users(
    first_name: Union[str, None] = None,
    last_name: Union[str, None] = None,
    zipcode: Union[str, None] = None,
    username: Union[str, None] = None,
    email: Union[EmailStr, None] = None,
    role: Union[RoleEnum, None] = None
):
    
    search = {}
    if first_name:
        search['first_name'] = first_name.title().strip()
    if last_name:
        search['last_name'] = last_name.title().strip()
    if username:
        search['username'] = username.lower().replace(" ", "")
    if zipcode:
        search['zipcode'] = zipcode.lower().replace(" ", "")
    if email:
        search['email'] = email.lower().replace(" ", "")
    if role:
        search['role'] = role

    results = user_collection.find(search)
    result_count = results.count()
    if result_count == 0:
        all_users = []
    else:
        all_users = [doc for doc in results]

    return {"user_count": result_count, "users": all_users}

# Get projects for user
@router.get('/{username}/projects', tags=['User'])
async def user_projects(username: str):
    user = get_user(user_collection, username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username {} does not exist.".format(username)
        )
    
    aql = f"""
    FOR v, e in 1..1 OUTBOUND 'user/{username}' memberOf
    FILTER CONTAINS(v._id, 'project/')
    RETURN v 
    """
    
    results = db.aql.execute(aql, batch_size=100)

    return [x for x in results]

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

    doc = {}
    user_d = user.dict()

    doc['email'] = user_d['email'].lower().replace(" ", "")
    doc['first_name'] = user_d['first_name'].title()
    doc['last_name'] = user_d['last_name'].title()
    doc['username'] = user_d['username'].lower().replace(" ","")
    doc['zipcode'] = user_d['zipcode'].lower().replace(" ","")
    doc['role'] = user_d['role']
    doc['image_path'] = user_d.get('image_path','')
    doc['disabled'] = False

    doc['available_funds'] = 0

    doc['_key'] = user_d['username'].lower().replace(" ", "")

    if password is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected 'password' query parameter. Got None."
        )

    doc['password'] = hash_password(password)
    
    user_collection.insert(doc)

    return doc

@router.put("/update/info", tags=['User'])
async def update_user(user: UserUpdate):
    update = user.dict()
    # update['role'] = RoleEnum
    update.pop("password", None)
    update.pop("role", None)

    user = get_user(user_collection, update['username'])
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username '{update['username']}' does not exist."
        )

    pop_list = ['utc_date_created', 'available_funds']
    for key in update.keys():
        if update[key] is None:
            pop_list.append(key)
    
    [update.pop(d, None) for d in pop_list]

    update['_key'] = update['username']
    
    new_user = user_collection.update(update, keep_none=False, return_new=True)

    return new_user

@router.put("/funds/add", tags=['User'])
async def add_funds_to_user(body: UserFunding):
    user = get_user(user_collection, body.username, doc_return=True)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{body.username}' not found."
        )
    
    user['available_funds'] = user.get('available_funds', 0) + body.additional_funds
    
    new_user = user_collection.update(user, keep_none=False, return_new=True)

    return new_user

@router.put("/update/password", tags=['User'])
async def update_user_pass(username: str, password: str):
    
    user = get_user(user_collection, username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with username '{}' does not exists.".format(username)
        )

    new_password = hash_password(password)

    user['password'] = new_password

    user_collection.update(user)

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

    user_collection.delete(user['_key'])

    return {
        "status_code": status.HTTP_200_OK,
        "deleted_user": parse_user_dict(user)
        }
