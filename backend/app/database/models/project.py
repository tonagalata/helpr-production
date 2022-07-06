from typing import List, Optional
from pydantic import BaseModel, Field
import datetime


class Project(BaseModel):
    project_name: str
    github_repo: str
    description: Optional[str]
    short_desc: Optional[str]
    utc_date_created: datetime.datetime = datetime.datetime.utcnow()
    icon_path: str = Field(default=None)


class ProjectUpdate(Project):
    github_repo: Optional[str]
    utc_date_created: Optional[datetime.datetime]
    hearts: Optional[int]
    funds: Optional[float]

class ProjectMember(BaseModel):
    project_key: str
    username: List[str]
    role: Optional[str] = "Member"

class ProjectFund(BaseModel):
    project_key: str
    username: str
    funding_amount: str
    transaction_datetime: datetime.datetime = datetime.datetime.utcnow()
 