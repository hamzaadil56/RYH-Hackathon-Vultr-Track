from fastapi import APIRouter
from services.InterviewQuestionService import InterviewQuestionAgent
from services.InterviewEvaluationService import InterviewEvaluationAgent
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
from models.Job import Job
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from core.database import get_db
from schemas.Interview import GetInterviewQuestionRequest, EvaluateInterviewRequest
from models.InterviewResult import InterviewResult
load_dotenv()

router = APIRouter(prefix="/interview")
client = AsyncOpenAI(api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1")
interview_question_agent = InterviewQuestionAgent(client, "llama-3.3-70b-versatile")
interview_evaluation_agent = InterviewEvaluationAgent(client, "llama-3.3-70b-versatile")
conversation_history = {}

@router.post("/question")
async def generate_interview_questions(request: GetInterviewQuestionRequest,db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == request.jobId).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if request.userId not in conversation_history:
        conversation_history[request.userId] = []
    else:
        conversation_history[request.userId].append({"question": request.previousQuestion, "answer": request.previousAnswer})
    response = await interview_question_agent.GenerateInterviewQuestion(job.title, job.description, conversation_history[request.userId])
    return {"question": response["question"], "isLastQuestion": response["isLastQuestion"]}

@router.post("/evaluate")
async def EvaluateInterview(request: EvaluateInterviewRequest, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == request.jobId).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if request.userId not in conversation_history:
        raise HTTPException(status_code=404, detail="User not found")
    response = await interview_evaluation_agent.EvaluateResponses(job.title, job.description, conversation_history[request.userId])
    conversation_history.pop(request.userId)
    interviewResult = InterviewResult(userId=request.userId, jobId=request.jobId, companyId=job.companyId, verdict=response["verdict"], reasoning=response["reasoning"])
    db.add(interviewResult)
    db.commit()
    db.refresh(interviewResult)
    return {"verdict": response["verdict"], "reasoning": response["reasoning"]}



