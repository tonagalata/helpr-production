from typing import Optional
from pydantic import BaseModel, Field


class University(BaseModel):
    name: str
    abbreviation: str
    sponsor: Optional[str] = Field(default=None)

class UniversityUpdate(University):
    name: Optional[str] = Field(default=None)
    short_name: Optional[str] = Field(default=None)

class CohortUniLink(BaseModel):
    cohort_key: str
    university_abbv: str
