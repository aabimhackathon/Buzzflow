from typing import Dict, Any
from ...config.settings import settings
from ...tools import tool_registry

def handle_health() -> Dict[str, Any]:
    return {
        "status": "HEALTHY",
        "service": settings.app_name,
        "version": settings.version,
        "environment": settings.environment
    }

def handle_status() -> Dict[str, Any]:
    return {
        "status": "ONLINE",
        "engine": "Vepari AI Core Intelligence Layer",
        "version": settings.version,
        "model": settings.gemini_model,
        "registered_tools_count": len(tool_registry.list_tools()),
        "security_gate": "5-Digit Security PIN & Risk-Level Confirmation Engine"
    }
