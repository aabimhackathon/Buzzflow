from typing import Dict, Any
from ...core.orchestrator import orchestrator
from ...models.context import BusinessContext

def handle_confirm(body: Dict[str, Any]) -> Dict[str, Any]:
    conf_id = body.get("confirmation_id") or body.get("id") or ""
    decision = body.get("decision", "APPROVED")
    user_id = body.get("user_id", "usr-owner")
    company_ctx = body.get("company_context")
    live_data = body.get("live_data")

    b_ctx = BusinessContext.from_dict(company_ctx)
    res = orchestrator.confirm_action(
        confirmation_id=conf_id,
        decision=decision,
        context=b_ctx,
        live_data=live_data
    )
    return res.to_dict()
