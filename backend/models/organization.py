from sqlalchemy import Column, Integer, String
from core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

    description = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    size = Column(String, nullable=True)
    website = Column(String, nullable=True)

    job_postings = relationship("JobPosting", back_populates="company", cascade="all, delete-orphan")
