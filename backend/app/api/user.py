from fastapi import APIRouter, HTTPException, Body, status
from app.database.models.user import User, UserUpdate
from app.auth.pass_validation import get_user
from app.core.validation import check_unique

from app.database.collection import (
    user_collection, cohort_collection, project_collection, db
)

router = APIRouter(prefix='/user')


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

# Create new user
@router.post("/signup", tags=['User'])
async def user_signup(user: User = Body(default=None)):

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
    doc.set(user.dict())
    doc.save()

    return doc.getStore()


