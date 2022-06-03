from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class UserUpdate(User):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
