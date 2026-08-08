from typing import Dict, Any
from ...core.orchestrator import orchestrator

def handle_command(body: Dict[str, Any]) -> Dict[str, Any]:
    cmd = body.get("command", body.get("prompt", ""))
    company_ctx = body.get("company_context")
    role = body.get("user_role", "owner")
    active_tab = body.get("active_tab", "vepari-ai")
    live_data = body.get("live_data")

    res = orchestrator.process_command(
        command=cmd,
        company_context=company_ctx,
        user_role=role,
        current_page=active_tab,
        live_data=live_data
    )
    return res.to_dict()
