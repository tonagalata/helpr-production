from typing import Optional
from pydantic import BaseModel, Field
import datetime


class Project(BaseModel):
    project_name: str
    github_repo: Optional[str]
    description: str
    short_desc: str
    date_created: datetime.datetime


class ProjectUpdate(Project):
    stars: Optional[int]
    funds: Optional[float]
