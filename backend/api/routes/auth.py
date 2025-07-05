from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.core.database import SessionLocal
from backend.schemas.auth import SignupRequest, SigninRequest, TokenResponse
from backend.services.auth_service import signup_org, signin_org

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=TokenResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    token = signup_org(db, data)
    return {"access_token": token}

@router.post("/signin", response_model=TokenResponse)
def signin(data: SigninRequest, db: Session = Depends(get_db)):
    token = signin_org(db, data)
    return {"access_token": token}
