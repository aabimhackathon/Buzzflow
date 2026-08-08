from typing import Dict, Any, List, Optional
from ..models.actions import UiAction

class ExecutionPlan:
    def __init__(self, tool_name: Optional[str] = None, tool_args: Optional[Dict[str, Any]] = None, ui_actions: Optional[List[UiAction]] = None):
        self.tool_name = tool_name
        self.tool_args = tool_args or {}
        self.ui_actions = ui_actions or []

class Planner:
    def plan(self, intent: str, entities: Dict[str, Any], user_input: str, current_page: str) -> ExecutionPlan:
        inp = user_input.lower()
        
        if intent == "SALES_QUERY":
            period = entities.get("period", "month")
            return ExecutionPlan(
                tool_name="get_sales",
                tool_args={"period": period}
            )

        if intent == "EXPENSE_QUERY":
            period = entities.get("period", "month")
            return ExecutionPlan(
                tool_name="get_expenses",
                tool_args={"period": period}
            )

        if intent == "PROFIT_QUERY":
            period = entities.get("period", "month")
            return ExecutionPlan(
                tool_name="get_profit",
                tool_args={"period": period}
            )

        if intent == "INVENTORY_QUERY":
            if "low" in inp or "reorder" in inp or "which products" in inp:
                return ExecutionPlan(
                    tool_name="get_low_stock",
                    tool_args={},
                    ui_actions=[UiAction.navigate("inventory")]
                )
            return ExecutionPlan(
                tool_name="get_inventory",
                tool_args={},
                ui_actions=[UiAction.navigate("inventory")]
            )

        if intent == "CUSTOMER_QUERY":
            if "overdue" in inp or "haven't paid" in inp or "unpaid" in inp:
                return ExecutionPlan(
                    tool_name="get_overdue_customers",
                    tool_args={},
                    ui_actions=[UiAction.navigate("accounting", "debtors-creditors")]
                )
            return ExecutionPlan(
                tool_name="get_customers",
                tool_args={},
                ui_actions=[UiAction.navigate("accounting", "debtors-creditors")]
            )

        if intent == "SUPPLIER_QUERY":
            if "overdue" in inp or "payables" in inp or "due" in inp:
                return ExecutionPlan(
                    tool_name="get_overdue_payables",
                    tool_args={},
                    ui_actions=[UiAction.navigate("accounting", "debtors-creditors")]
                )
            return ExecutionPlan(
                tool_name="get_suppliers",
                tool_args={},
                ui_actions=[UiAction.navigate("accounting", "debtors-creditors")]
            )

        if intent == "VOUCHER_CREATE":
            amount = entities.get("amount", 25000.0)
            party = entities.get("party_name", "ABC Suppliers")
            v_type = "payment" if "payment" in inp or "pay" in inp else "receipt"
            return ExecutionPlan(
                tool_name="create_voucher_draft",
                tool_args={
                    "voucher_type": v_type,
                    "amount": amount,
                    "narration": f"Payment voucher for {party}",
                    "party_name": party
                },
                ui_actions=[UiAction.navigate("accounting", "new-voucher")]
            )

        if intent == "VOUCHER_POST":
            return ExecutionPlan(
                tool_name="post_voucher",
                tool_args={
                    "amount": entities.get("amount", 25000.0),
                    "party_name": entities.get("party_name", "Vendor")
                }
            )

        if intent == "VOUCHER_VALIDATE":
            return ExecutionPlan(
                tool_name="validate_voucher",
                tool_args={"items": [{"drCr": "Dr", "amount": 25000}, {"drCr": "Cr", "amount": 25000}]}
            )

        if intent == "REPORT_QUERY":
            if "trial balance" in inp:
                return ExecutionPlan(
                    tool_name="generate_trial_balance",
                    tool_args={},
                    ui_actions=[UiAction.navigate("accounting", "reports")]
                )
            if "balance sheet" in inp:
                return ExecutionPlan(
                    tool_name="generate_balance_sheet",
                    tool_args={},
                    ui_actions=[UiAction.navigate("accounting", "reports")]
                )
            if "profit and loss" in inp or "p&l" in inp:
                return ExecutionPlan(
                    tool_name="generate_profit_loss",
                    tool_args={},
                    ui_actions=[UiAction.navigate("accounting", "reports")]
                )

        if intent == "NAVIGATION":
            if "inventory" in inp:
                return ExecutionPlan(ui_actions=[UiAction.navigate("inventory")])
            if "profit and loss" in inp or "p&l" in inp:
                return ExecutionPlan(ui_actions=[UiAction.navigate("accounting", "reports")])
            if "dashboard" in inp:
                return ExecutionPlan(ui_actions=[UiAction.navigate("dashboard")])
            if "daybook" in inp:
                return ExecutionPlan(ui_actions=[UiAction.navigate("accounting", "daybook")])
            if "schemes" in inp or "government" in inp:
                return ExecutionPlan(ui_actions=[UiAction.navigate("schemes")])

        if intent == "GOVERNMENT_SCHEME":
            return ExecutionPlan(
                tool_name="find_government_schemes",
                tool_args={},
                ui_actions=[UiAction.navigate("schemes")]
            )

        if intent == "BUSINESS_ANALYSIS":
            return ExecutionPlan(
                tool_name="get_profit",
                tool_args={"period": "month"}
            )

        if intent == "MEMORY_QUERY":
            return ExecutionPlan(tool_name="get_business_memory", tool_args={})

        if intent == "MEMORY_SAVE":
            return ExecutionPlan(
                tool_name="save_business_memory",
                tool_args={"memory_text": user_input, "category": "BUSINESS_RULE"}
            )

        return ExecutionPlan()

planner = Planner()
