from pydantic import BaseModel, Field
from typing import Optional

class JobCreationRequest(BaseModel):
    job_title: str = Field(..., example="Senior Backend Developer")
    company_name: str
    location: Optional[str] = "Remote"
    experience_level: Optional[str] = "Mid-level"
    skills_required: list[str]
    industry: Optional[str] = "Tech"
    employment_type: Optional[str] = "Full-time"
