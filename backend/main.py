from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.database import engine
from api.routes.auth import router as auth_router
from api.routes.jobs import router as jobs_router
from api.routes.initialScreening import router as initial_screening_router
from api.routes.interview import router as interview_router
from api.routes.interviewResults import router as interview_results_router
from core.database import Base
from core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="HiredMind API",
    description="AI Powered Hiring Application API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(initial_screening_router)
app.include_router(interview_router)
app.include_router(interview_results_router)

@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to HiredMind API",
        "version": "1.0.0",
        "docs": "/docs",
        "test_page": "/static/test_streaming.html"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
