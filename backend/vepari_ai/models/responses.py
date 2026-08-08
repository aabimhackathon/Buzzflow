from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List

@dataclass
class AiResponse:
    message: str
    intent: str = "GENERAL_CONVERSATION"
    confidence: float = 1.0
    actions: List[Dict[str, Any]] = field(default_factory=list)
    data: Optional[Dict[str, Any]] = None
    requires_confirmation: bool = False
    confirmation_id: Optional[str] = None
    operating_state: str = "COMPLETED"
    logs: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "message": self.message,
            "intent": self.intent,
            "confidence": self.confidence,
            "actions": self.actions,
            "data": self.data,
            "requires_confirmation": self.requires_confirmation,
            "confirmation_id": self.confirmation_id,
            "operating_state": self.operating_state,
            "logs": self.logs
        }
