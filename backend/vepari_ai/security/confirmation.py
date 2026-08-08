import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from .permissions import RiskLevel

class ConfirmationManager:
    def __init__(self):
        self._pending_confirmations: Dict[str, Dict[str, Any]] = {}

    def is_confirmation_required(self, risk_level: str) -> bool:
        """Deterministic rule: FINANCIAL_WRITE and DESTRUCTIVE strictly require confirmation."""
        risk_str = str(risk_level).upper()
        return risk_str in [RiskLevel.FINANCIAL_WRITE.value, RiskLevel.DESTRUCTIVE.value, "FINANCIAL_WRITE", "DESTRUCTIVE"]

    def create_pending_confirmation(
        self,
        tool_name: str,
        tool_args: Dict[str, Any],
        summary: str,
        company_id: str,
        user_id: str,
        risk_level: str
    ) -> str:
        conf_id = f"conf-{uuid.uuid4().hex[:8]}"
        self._pending_confirmations[conf_id] = {
            "id": conf_id,
            "tool_name": tool_name,
            "tool_args": tool_args,
            "summary": summary,
            "company_id": company_id,
            "user_id": user_id,
            "risk_level": risk_level,
            "created_at": datetime.now().isoformat(),
            "status": "PENDING"
        }
        return conf_id

    def get_pending_confirmation(self, conf_id: str) -> Optional[Dict[str, Any]]:
        return self._pending_confirmations.get(conf_id)

    def resolve_confirmation(self, conf_id: str, decision: str) -> Optional[Dict[str, Any]]:
        conf = self._pending_confirmations.get(conf_id)
        if conf and conf["status"] == "PENDING":
            conf["status"] = decision.upper()
            return conf
        return None

confirmation_manager = ConfirmationManager()
