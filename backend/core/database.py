from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
from urllib.parse import urlparse

# Check if the URI already contains sslmode in the query string
parsed_url = urlparse(settings.database_url)
use_ssl = "sslmode=require" in parsed_url.query

# Configure create_engine with or without connect_args as needed
if use_ssl:
    engine = create_engine(settings.database_url)
else:
    # If you need to force SSL manually, uncomment this line:
    # engine = create_engine(settings.database_url, connect_args={"sslmode": "require"})
    engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
