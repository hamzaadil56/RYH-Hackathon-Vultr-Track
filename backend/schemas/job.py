from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    requirements: Optional[str] = None


class JobRead(BaseModel):
    id: int
    title: str
    description: str
    location: Optional[str]
    requirements: Optional[str]
    created_at: datetime
    company_id: int

    class Config:
        orm_mode = True
