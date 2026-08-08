from typing import Dict, Any
from ...core.orchestrator import orchestrator

def handle_chat(body: Dict[str, Any]) -> Dict[str, Any]:
    prompt = body.get("prompt", body.get("message", ""))
    company_ctx = body.get("company_context")
    role = body.get("user_role", "owner")
    page = body.get("current_page", "vepari-ai")

    res = orchestrator.process_command(
        command=prompt,
        company_context=company_ctx,
        user_role=role,
        current_page=page
    )
    return res.to_dict()
