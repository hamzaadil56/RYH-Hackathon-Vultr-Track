from fastapi import FastAPI
from backend.api.routes import agents
from backend.core.database import engine, Base

# Criar as tabelas (em ambiente de dev)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
