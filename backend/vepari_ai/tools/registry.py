from typing import Dict, Any, Callable, Optional, List
from dataclasses import dataclass, field
from ..security.permissions import check_permission, Permission, RiskLevel
from ..security.confirmation import confirmation_manager

@dataclass
class ToolDefinition:
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    permission: str
    risk_level: str
    confirmation_required: bool
    handler: Callable

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, ToolDefinition] = {}

    def register(
        self,
        name: str,
        description: str,
        input_schema: Dict[str, Any],
        output_schema: Dict[str, Any],
        permission: str,
        risk_level: str,
        confirmation_required: bool,
        handler: Callable
    ):
        self._tools[name] = ToolDefinition(
            name=name,
            description=description,
            input_schema=input_schema,
            output_schema=output_schema,
            permission=permission,
            risk_level=risk_level,
            confirmation_required=confirmation_required,
            handler=handler
        )

    def get_tool(self, name: str) -> Optional[ToolDefinition]:
        return self._tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "permission": tool.permission,
                "risk_level": tool.risk_level,
                "confirmation_required": tool.confirmation_required
            }
            for tool in self._tools.values()
        ]

    def execute_tool(
        self,
        name: str,
        args: Dict[str, Any],
        context: Any,
        live_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        tool = self.get_tool(name)
        if not tool:
            return {
                "success": False,
                "error": f"Tool '{name}' not found in Vepari AI Tool Registry.",
                "data": None
            }

        # Check permissions
        user_role = getattr(context, "user_role", "owner")
        if not check_permission(user_role, tool.permission):
            return {
                "success": False,
                "error": f"Permission denied for role '{user_role}'. Required permission: '{tool.permission}'.",
                "data": None
            }

        # Execute handler
        try:
            result = tool.handler(args, context, live_data)
            return {
                "success": True,
                "tool": name,
                "data": result,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "tool": name,
                "error": str(e),
                "data": None
            }

tool_registry = ToolRegistry()
