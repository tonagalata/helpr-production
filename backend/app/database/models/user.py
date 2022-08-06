from pydantic import BaseModel, Field, EmailStr
from enum import Enum
from typing import Optional

class RoleEnum(str, Enum):
    GUEST = 'GUEST'
    ADMIN = 'ADMIN'
    RBT = 'RBT'
    PARENT = 'PARENT'
    CHILD = 'CHILD'

class User(BaseModel):
    first_name: str = Field(default=None)
    last_name: str = Field(default=None)
    username: str = Field(default=None)
    zipcode: str = Field(default=None)
    email: EmailStr = Field(default=None)
    disabled: bool = Field(default=False)
    image_path: Optional[str] = Field(default=None)
    role: RoleEnum

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(User):
    first_name: Optional[str]
    last_name: Optional[str]
    zipcode: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    disabled: Optional[bool] = Field(default=None)


class UserFunding(BaseModel):
    username: str
    additional_funds: int = Field(gt=0)
