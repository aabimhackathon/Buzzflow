from typing import Dict, Any, Optional, List
from ..models.context import BusinessContext
from ..models.responses import AiResponse
from ..models.actions import UiAction
from ..security.permissions import check_permission
from ..security.confirmation import confirmation_manager
from ..tools import tool_registry
from .intent import intent_detector
from .context import context_builder
from .planner import planner
from .reasoning import reasoning_engine
from .response import response_builder

class VepariOrchestrator:
    """
    Master Vepari AI Operating System Orchestrator.
    Executes the 11-step pipeline and enforces deterministic security rules.
    """
    def __init__(self, registry=None):
        self.registry = registry or tool_registry

    def process_command(
        self,
        command: str,
        company_context: Optional[Dict[str, Any]] = None,
        user_role: str = "owner",
        current_page: str = "vepari-ai",
        live_data: Optional[Dict[str, Any]] = None
    ) -> AiResponse:
        logs: List[str] = []
        
        # 1. INPUT NORMALIZATION
        norm_command = command.strip()
        logs.append(f"State: LISTENING -> Normalized command: '{norm_command}'")

        # 2. CONTEXT BUILDING
        b_context = context_builder.build_context(
            company_data=company_context,
            user_role=user_role,
            current_page=current_page
        )
        logs.append(f"State: UNDERSTANDING -> Context initialized for {b_context.company_name} ({b_context.user_role})")

        # 3. INTENT DETECTION
        intent_res = intent_detector.detect(norm_command, current_page=current_page)
        intent = intent_res["intent"]
        confidence = intent_res["confidence"]
        entities = intent_res["entities"]
        logs.append(f"State: PLANNING -> Intent detected: '{intent}' (Confidence: {confidence:.2f})")

        # 4. PLANNING & TOOL SELECTION
        plan = planner.plan(intent, entities, norm_command, current_page)
        ui_actions = [a.to_dict() for a in plan.ui_actions]

        # If plan has no tool, generate direct response or UI navigation
        if not plan.tool_name:
            reasoning_text = reasoning_engine.format_reasoning_response(intent, norm_command, None, b_context)
            logs.append("State: RESPONDING -> Executed UI/Direct response.")
            return response_builder.build_response(
                message=reasoning_text,
                intent=intent,
                confidence=confidence,
                actions=ui_actions,
                operating_state="COMPLETED",
                logs=logs
            )

        tool_name = plan.tool_name
        tool_args = plan.tool_args
        tool_def = self.registry.get_tool(tool_name)
        logs.append(f"State: RETRIEVING -> Selected tool: '{tool_name}' with args: {tool_args}")

        if not tool_def:
            logs.append(f"State: ERROR -> Tool '{tool_name}' missing from registry.")
            return response_builder.build_response(
                message=f"System error: Tool '{tool_name}' is not registered.",
                intent=intent,
                operating_state="ERROR",
                logs=logs
            )

        # 5. PERMISSION CHECK
        if not check_permission(b_context.user_role, tool_def.permission):
            logs.append(f"State: ERROR -> Permission denied for role '{b_context.user_role}'.")
            return response_builder.build_response(
                message=f"Access Denied: Your role ({b_context.user_role}) lacks required permission ({tool_def.permission}).",
                intent=intent,
                operating_state="ERROR",
                logs=logs
            )

        # 6. RISK CLASSIFICATION & CONFIRMATION CHECK
        if confirmation_manager.is_confirmation_required(tool_def.risk_level):
            conf_id = confirmation_manager.create_pending_confirmation(
                tool_name=tool_name,
                tool_args=tool_args,
                summary=f"Post financial transaction ({tool_args.get('amount', 0)}) to ledger",
                company_id=b_context.company_id,
                user_id=b_context.user_id,
                risk_level=tool_def.risk_level
            )
            logs.append(f"State: WAITING_FOR_CONFIRMATION -> Generated Confirmation ID: {conf_id}")
            ui_actions.append(UiAction(
                type="REQUEST_CONFIRMATION",
                target=tool_name,
                payload={"confirmation_id": conf_id, "summary": f"Confirmation required to post transaction."}
            ).to_dict())

            return response_builder.build_response(
                message=f"Financial action requires explicit user confirmation. Please confirm posting.",
                intent=intent,
                confidence=confidence,
                actions=ui_actions,
                requires_confirmation=True,
                confirmation_id=conf_id,
                operating_state="WAITING_FOR_CONFIRMATION",
                logs=logs
            )

        # 7. TOOL EXECUTION
        logs.append(f"State: EXECUTING -> Executing tool '{tool_name}'...")
        tool_result = self.registry.execute_tool(tool_name, tool_args, b_context, live_data)

        # 8. RESULT VALIDATION & REASONING
        logs.append("State: RESPONDING -> Validating result and synthesizing reasoning response...")
        message = reasoning_engine.format_reasoning_response(intent, norm_command, tool_result, b_context)

        return response_builder.build_response(
            message=message,
            intent=intent,
            confidence=confidence,
            actions=ui_actions,
            data=tool_result.get("data"),
            operating_state="COMPLETED",
            logs=logs
        )

    def confirm_action(self, confirmation_id: str, decision: str, context: Any, live_data: Optional[Dict[str, Any]] = None) -> AiResponse:
        resolved = confirmation_manager.resolve_confirmation(confirmation_id, decision)
        if not resolved:
            return response_builder.build_response(
                message=f"Confirmation ID '{confirmation_id}' is invalid or expired.",
                intent="VOUCHER_POST",
                operating_state="ERROR"
            )

        if decision.upper() == "REJECTED":
            return response_builder.build_response(
                message="Action was cancelled by user.",
                intent="VOUCHER_POST",
                operating_state="COMPLETED"
            )

        # Execute confirmed pending tool
        tool_name = resolved["tool_name"]
        tool_args = resolved["tool_args"]
        tool_args["confirmation_id"] = confirmation_id

        tool_result = self.registry.execute_tool(tool_name, tool_args, context, live_data)
        message = reasoning_engine.format_reasoning_response("VOUCHER_POST", "Confirm action", tool_result, context)

        return response_builder.build_response(
            message=message,
            intent="VOUCHER_POST",
            data=tool_result.get("data"),
            operating_state="COMPLETED",
            logs=[f"Confirmation {confirmation_id} APPROVED. Executed {tool_name}."]
        )

orchestrator = VepariOrchestrator()
