from typing import Optional
from pydantic import BaseModel, Field


class University(BaseModel):
    name: str
    short_name: str
    sponsor: Optional[str] = Field(default=None)

class UniversityUpdate(University):
    name: Optional[str] = Field(default=None)
    short_name: Optional[str] = Field(default=None)
