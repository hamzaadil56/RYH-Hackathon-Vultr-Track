from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_company
from models.models import JobPosting
from schemas.job import JobCreate, JobRead

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("/", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    company=Depends(get_current_company)
):
    job_posting = JobPosting(
        title=job.title,
        description=job.description,
        location=job.location,
        requirements=job.requirements,
        company_id=company.id
    )
    db.add(job_posting)
    db.commit()
    db.refresh(job_posting)
    return job_posting


@router.get("/", response_model=List[JobRead])
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(JobPosting).all()
    return jobs


@router.get("/{job_id}", response_model=JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
