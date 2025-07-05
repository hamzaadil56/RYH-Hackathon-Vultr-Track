from sqlalchemy.orm import Session
from models.organization import Organization
from schemas.auth import SignupRequest, SigninRequest
from core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status


def signup_org(db: Session, data: SignupRequest):
    if db.query(Organization).filter_by(email=data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    org = Organization(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password)
    )
    db.add(org)
    db.commit()
    db.refresh(org)

    return create_access_token({"sub": org.email})


def signin_org(db: Session, data: SigninRequest):
    org = db.query(Organization).filter_by(email=data.email).first()
    if not org or not verify_password(data.password, org.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return create_access_token({"sub": org.email})
