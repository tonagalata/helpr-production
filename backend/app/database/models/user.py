from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class User(BaseModel):
    first_name: str = Field(default=None)
    last_name: str = Field(default=None)
    username: str = Field(default=None)
    email: EmailStr = Field(default=None)
    disabled: bool = Field(default=False)
    image_path: Optional[str] = Field(default=None)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(User):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    disabled: Optional[bool] = Field(default=None)

class UserFunding(BaseModel):
    username: str
    additional_funds: int = Field(gt=0)
