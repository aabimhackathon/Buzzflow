from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List

@dataclass
class ChatRequest:
    prompt: str
    company_context: Optional[Dict[str, Any]] = None
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    user_role: str = "owner"
    current_page: str = "vepari-ai"

@dataclass
class CommandRequest:
    command: str
    company_context: Optional[Dict[str, Any]] = None
    active_tab: str = "vepari-ai"
    live_data: Optional[Dict[str, Any]] = None

@dataclass
class ConfirmRequest:
    confirmation_id: str
    decision: str  # APPROVED | REJECTED
    user_id: str = "usr-owner"
    pin: Optional[str] = None
