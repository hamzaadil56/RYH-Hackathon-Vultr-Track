from pydantic import BaseModel
class GetInterviewQuestionRequest(BaseModel):
    userId: int
    jobId: int
    previousQuestion: str | None = None
    previousAnswer: str | None = None

class EvaluateInterviewRequest(BaseModel):
    userId: int
    jobId: int