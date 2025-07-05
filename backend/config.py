from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "postgresql://username:password@localhost:5432/hiredmind_db"

    # JWT Configuration
    secret_key: str = "your-secret-key-here-make-it-long-and-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Application Configuration
    debug: bool = True
    allowed_hosts: List[str] = ["localhost", "127.0.0.1"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
