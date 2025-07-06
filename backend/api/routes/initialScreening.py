from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from services.ExtractTextService import ExtractTextService
from models.Job import Job
from core.database import get_db
from services.InitialScreeningService import InitialScreeningService
from schemas.InitialScreening import EvaluationRequest
import json
from core.security import get_current_company

router = APIRouter(prefix="/screening", tags=["screening"])


@router.get("/initial")
async def initial_screening(jobId: str, resume: UploadFile = File(...), db: Session = Depends(get_db)):
    extract_text_service = ExtractTextService()
    initial_screening_service = InitialScreeningService()
    text = extract_text_service.extract_and_clean_text(resume)
    job = db.query(Job).filter_by(id=jobId).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    questions = initial_screening_service.getScreeningQuestions(text, job.description)
    return {"questions": json.loads(questions)["questions"]}

@router.post("/evaluate")
async def evaluate_responses(request: EvaluationRequest, db: Session = Depends(get_db)):
    initial_screening_service = InitialScreeningService()
    job = db.query(Job).filter_by(id=request.jobId).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    evaluation = initial_screening_service.evaluateResponses(request.qaPairs, job.description)
    return {"evaluation": json.loads(evaluation)}

