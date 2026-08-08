import os
from typing import Optional

class Settings:
    def __init__(self):
        self.app_name: str = "Vepari AI Core"
        self.version: str = "2.5.0"
        self.environment: str = os.getenv("ENVIRONMENT", "production")
        self.port: int = int(os.getenv("PYTHON_PORT", "8000"))
        self.backend_url: str = os.getenv("BACKEND_URL", "http://127.0.0.1:3000")
        self.gemini_api_key: Optional[str] = os.getenv("GEMINI_API_KEY", None)
        self.gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        self.fallback_model: str = "gemini-2.5-flash"
        self.secret_key: str = os.getenv("SECRET_KEY", "vepari-ai-secure-secret-key-2026")
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
