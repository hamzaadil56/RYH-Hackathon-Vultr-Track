from fastapi import APIRouter

from sqlalchemy.orm import Session
from fastapi import Depends
from core.database import get_db
from models.InterviewResult import InterviewResult

router = APIRouter(prefix="/interview-results")

@router.get("/")
async def get_interview_results(db: Session = Depends(get_db)):
    interview_results = db.query(InterviewResult).all()
    return interview_results