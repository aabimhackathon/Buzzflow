from typing import Dict, Any, Optional, List
from ..models.responses import AiResponse

class ResponseBuilder:
    def build_response(
        self,
        message: str,
        intent: str = "GENERAL_CONVERSATION",
        confidence: float = 1.0,
        actions: Optional[List[Dict[str, Any]]] = None,
        data: Optional[Dict[str, Any]] = None,
        requires_confirmation: bool = False,
        confirmation_id: Optional[str] = None,
        operating_state: str = "COMPLETED",
        logs: Optional[List[str]] = None
    ) -> AiResponse:
        return AiResponse(
            message=message,
            intent=intent,
            confidence=confidence,
            actions=actions or [],
            data=data,
            requires_confirmation=requires_confirmation,
            confirmation_id=confirmation_id,
            operating_state=operating_state,
            logs=logs or []
        )

response_builder = ResponseBuilder()
