import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field



class Cohort(BaseModel):
    name: str
    course: str
    course_repo: Optional[str] = Field(default=None)
    start_date: datetime.date
    end_date: datetime.date
    ssm: str
    ssm_email: EmailStr


class CohortUpdate(Cohort):
    name: Optional[str] = Field(default=None)
    course: Optional[str] = Field(default=None)
    start_date: Optional[datetime.date] = Field(default=None)
    end_date: Optional[datetime.date] = Field(default=None)
    ssm: Optional[str] = Field(default=None)
    ssm_email: Optional[EmailStr] = Field(default=None)

class CohortUsers(BaseModel):
    cohort_key: str
    users: List[str]
    role: str = Field(default='Student')
