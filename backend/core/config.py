# config.py
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Cloud Database Configuration (NeonDB)
    database_url: str = "postgresql://neondb_owner:npg_U39xsbjPDcKy@ep-wild-rice-a1j76faw-pooler.ap-southeast-1.aws.neon.tech/hiredmind?sslmode=require&channel_binding=require"

    # JWT Configuration
    secret_key: str = "5f8d3e2a9c1b4f7d8a6e4c2b9f7d1e3a7c5b2d9f8a1e4c3b6d7f9e0a1b2c3d4e"

    algorithm: str = "HS256"
    access_token_expire_minutes: int = 300

    # Application Configuration
    debug: bool = True
    allowed_hosts: List[str] = ["localhost", "127.0.0.1"]

    class Config:
        env_file = "../.env"
        case_sensitive = False


settings = Settings()
print("Database URL:", settings.database_url)
