from fastapi import FastAPI
from backend.api.routes import job_creator

app = FastAPI(
    title="HiredMind Job Agent API",
    version="1.0.0"
)

app.include_router(job_creator.router, prefix="/api/agent")
