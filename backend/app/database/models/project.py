from typing import Optional
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
    stars: Optional[int]
    funds: Optional[float]
