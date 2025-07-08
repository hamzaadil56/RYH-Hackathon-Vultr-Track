from agents import function_tool, Runner, ItemHelpers
from hiredmind_agents.instructions.job_creator_instructions import JOB_CREATOR_INSTRUCTIONS
from hiredmind_agents.agents_manager import Agents
import asyncio
import json
from typing import AsyncGenerator
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_company, get_current_user
from models.Company import Company
from openai.types.responses import ResponseTextDeltaEvent
from hiredmind_agents.job_creator_agent import job_creator_agent
from schemas.Job import JobCreationRequest, JobCreationPromptRequest
from models.Job import Job
from datetime import datetime, timezone
# Import your agent manager and job creator
# import sys
# import os
# sys.path.append(os.path.join(os.path.dirname(
#     __file__), '..', '..', 'hiredmind_agents'))


agents_manager = Agents()

router = APIRouter(prefix="/jobs", tags=["jobs"])





async def stream_job_creation(job_request: JobCreationPromptRequest, company: Company) -> AsyncGenerator[str, None]:
    """
    Stream the job creation process.
    """
    # Create the input for the agent
    input_text = f"""
        Here is the company context:
        Company Name: {company.name}
        Company Description: {company.description}
        Industry: {company.industry}

        Here is the user's prompt:

        {job_request.user_prompt}

    """

    try:
        # Run the agent with streaming
        result = Runner.run_streamed(job_creator_agent, input=input_text)

        # Stream the events
        async for event in result.stream_events():
            if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                # Stream the text delta
                if event.data.delta:
                    yield f"data: {json.dumps({'type': 'text_delta', 'content': event.data.delta})}\n\n"

            elif event.type == "run_item_stream_event":
                if event.item.type == "tool_call_item":
                    yield f"data: {json.dumps({'type': 'tool_call', 'message': 'Tool is being called...'})}\n\n"

                elif event.item.type == "tool_call_output_item":
                    yield f"data: {json.dumps({'type': 'tool_output', 'message': 'Tool execution completed'})}\n\n"

                elif event.item.type == "message_output_item":
                    # Send the complete message
                    message_content = ItemHelpers.text_message_output(
                        event.item)
                    yield f"data: {json.dumps({'type': 'message_complete', 'content': message_content})}\n\n"

        # Send completion signal
        yield f"data: {json.dumps({'type': 'complete', 'message': 'Job creation completed'})}\n\n"

    except Exception as e:
        # Send error signal
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"


@router.post("/create-job-posting/stream")
async def create_job_stream(
    job_request: JobCreationRequest,
    current_company: Company = Depends(get_current_company)
):
    """
    Create a job posting with streaming response.
    """
    return StreamingResponse(
        stream_job_creation(job_request, current_company),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        }
    )

@router.post("/create")
async def create_job(job_request: JobCreationRequest, db: Session = Depends(get_db), current_company: Company = Depends(get_current_company)):
    try:
        job = Job(
            title=job_request.title,
            description=job_request.description,
            companyId=current_company.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return {"job_id": job.id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating job: {str(e)}")


@router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job": job}

@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs










# @router.post("/create", response_model=JobCreationResponse)
# async def create_job(
#     job_request: JobCreationRequest,
#     current_company: Company = Depends(get_current_company)
# ):
#     """
#     Create a job posting (non-streaming version).
#     """
#     try:
#         # Create the input for the agent
#         input_text = f"""
#         Create a job post for: {job_request.job_title}

#         Additional Description: {job_request.description}
#         Requirements: {job_request.requirements}
#         Company Context: {job_request.company_context or f"Company: {current_company.name}, Industry: {current_company.industry}, Size: {current_company.size}"}

#         Please create a comprehensive job posting.
#         """

#         # Run the agent
#         result = agents_manager.run_agent("JobCreator", input_text)

#         return JobCreationResponse(
#             job_post=result.final_output,
#             status="completed"
#         )

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error creating job posting: {str(e)}"
#         )
