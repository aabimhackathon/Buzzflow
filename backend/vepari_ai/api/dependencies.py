from ..core.orchestrator import orchestrator, VepariOrchestrator
from ..config.settings import settings

def get_orchestrator() -> VepariOrchestrator:
    return orchestrator

def get_settings():
    return settings
