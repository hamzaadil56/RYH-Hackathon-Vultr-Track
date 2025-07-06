from pydantic import BaseModel

class EvaluationRequest(BaseModel):
    jobId: str
    qaPairs: list[dict]

