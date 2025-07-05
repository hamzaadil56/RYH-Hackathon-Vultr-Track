from fastapi import APIRouter, HTTPException
from backend.models.job_input import JobCreationRequest
from backend.agents.job_creator import generate_job_description

router = APIRouter()

@router.post("/job/create-description")
async def create_job_description(request: JobCreationRequest):
    try:
        description = generate_job_description(request.dict())
        return {"job_description": description}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
