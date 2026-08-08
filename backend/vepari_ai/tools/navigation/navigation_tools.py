from typing import Dict, Any, Optional
from ...security.permissions import Permission, RiskLevel
from ...models.actions import UiAction

def register_navigation_tools(registry):

    def nav_handler(target_tab: str, sub_tab: Optional[str] = None):
        def _handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
            action = UiAction.navigate(target_tab, sub_tab)
            return {
                "navigated": True,
                "target_tab": target_tab,
                "sub_tab": sub_tab,
                "ui_action": action.to_dict()
            }
        return _handler

    nav_tools = [
        ("navigate_to_dashboard", "Navigate user screen to main Dashboard view.", "dashboard", None),
        ("navigate_to_accounting", "Navigate user screen to Accounting Ledger view.", "accounting", None),
        ("navigate_to_daybook", "Navigate user screen to Day Book vouchers view.", "accounting", "daybook"),
        ("navigate_to_inventory", "Navigate user screen to Inventory Stock view.", "inventory", None),
        ("navigate_to_customers", "Navigate user screen to Customers Debtors view.", "accounting", "debtors-creditors"),
        ("navigate_to_suppliers", "Navigate user screen to Suppliers Creditors view.", "accounting", "debtors-creditors"),
        ("navigate_to_reports", "Navigate user screen to Financial Reports view.", "accounting", "reports"),
        ("navigate_to_profit_loss", "Navigate user screen to Profit & Loss statement.", "accounting", "reports"),
        ("navigate_to_balance_sheet", "Navigate user screen to Balance Sheet statement.", "accounting", "reports"),
        ("navigate_to_schemes", "Navigate user screen to Government Schemes.", "schemes", None),
        ("open_ai_center", "Open Vepari AI Operating System Command Center.", "vepari-ai", None),
        ("open_memory", "Open Vepari AI Business Memory Engine.", "memory", None),
        ("open_notifications", "Open System Notifications drawer.", "notifications", None)
    ]

    for name, desc, tab, sub in nav_tools:
        registry.register(
            name=name,
            description=desc,
            input_schema={},
            output_schema={"navigated": "bool", "target_tab": "str"},
            permission="NONE",
            risk_level=RiskLevel.READ.value,
            confirmation_required=False,
            handler=nav_handler(tab, sub)
        )
