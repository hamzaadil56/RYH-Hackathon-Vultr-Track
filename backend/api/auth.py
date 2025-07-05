from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import Company, User
from schemas import (
    CompanyCreate, CompanyResponse, CompanyLogin,
    UserCreate, UserResponse, UserLogin,
    Token
)
from auth import (
    get_password_hash, authenticate_company, authenticate_user,
    create_access_token, get_current_company, get_current_user
)
from config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/company/register", response_model=CompanyResponse)
def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Register a new company."""
    # Check if company already exists
    existing_company = db.query(Company).filter(
        (Company.email == company.email) | (Company.name == company.name)
    ).first()

    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this email or name already exists"
        )

    # Create new company
    hashed_password = get_password_hash(company.password)
    db_company = Company(
        name=company.name,
        email=company.email,
        password_hash=hashed_password,
        description=company.description,
        industry=company.industry,
        size=company.size,
        website=company.website
    )

    db.add(db_company)
    db.commit()
    db.refresh(db_company)

    return db_company


@router.post("/company/login", response_model=Token)
def login_company(company_login: CompanyLogin, db: Session = Depends(get_db)):
    """Login for companies."""
    company = authenticate_company(
        db, company_login.email, company_login.password)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": company.email, "company_id": company.id},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/user/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if company exists
    company = db.query(Company).filter(Company.id == user.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        company_id=user.company_id,
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/user/login", response_model=Token)
def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login for users."""
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "company_id": user.company_id, "user_id": user.id},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """OAuth2 compatible token login, get an access token for future requests."""
    # Try to authenticate as company first
    company = authenticate_company(db, form_data.username, form_data.password)
    if company:
        access_token_expires = timedelta(
            minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": company.email, "company_id": company.id},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # Try to authenticate as user
    user = authenticate_user(db, form_data.username, form_data.password)
    if user:
        access_token_expires = timedelta(
            minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user.email,
                  "company_id": user.company_id, "user_id": user.id},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.get("/company/me", response_model=CompanyResponse)
def get_current_company_info(current_company: Company = Depends(get_current_company)):
    """Get current company information."""
    return current_company


@router.get("/user/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user
