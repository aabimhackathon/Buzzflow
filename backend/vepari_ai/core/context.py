from typing import Dict, Any, Optional
from ..models.context import BusinessContext

class ContextBuilder:
    def build_context(
        self,
        company_data: Optional[Dict[str, Any]] = None,
        user_role: str = "owner",
        current_page: str = "vepari-ai",
        conversation_history: Optional[list] = None
    ) -> BusinessContext:
        ctx_data = company_data or {}
        ctx_data["user_role"] = user_role
        ctx_data["current_page"] = current_page
        if conversation_history:
            ctx_data["recent_conversation"] = conversation_history[-5:]

        return BusinessContext.from_dict(ctx_data)

context_builder = ContextBuilder()
