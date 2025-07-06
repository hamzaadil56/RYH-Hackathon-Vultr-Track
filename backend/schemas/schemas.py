from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Company schemas
class CompanyBase(BaseModel):
    name: str
    email: EmailStr
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    website: Optional[str] = None


class CompanyCreate(CompanyBase):
    password: str


class CompanyLogin(BaseModel):
    email: EmailStr
    password: str


class CompanyResponse(CompanyBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: Optional[str] = "user"


class UserCreate(UserBase):
    company_id: int
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    company_id: Optional[int] = None
    user_id: Optional[int] = None
