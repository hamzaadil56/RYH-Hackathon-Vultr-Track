from pydantic import BaseModel
from typing import Optional

class JobCreationPromptRequest(BaseModel):
    user_prompt: str


class JobCreationResponse(BaseModel):
    job_post: str
    status: str = "completed"

class JobCreationRequest(BaseModel):
    title: str
    description: str        #Assuming everything just comes in description