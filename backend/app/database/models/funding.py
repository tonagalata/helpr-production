from typing import Optional
from pydantic import BaseModel
import datetime


class FundingRequest(BaseModel):
    username: str
    project_id: str
    funding_amount: float 
    funding_currency: str = 'USD'
    funding_date: datetime.datetime = datetime.datetime.utcnow() 
