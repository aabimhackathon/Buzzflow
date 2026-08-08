from typing import Dict, Any, Optional, List
from ...security.permissions import Permission, RiskLevel

def register_customer_tools(registry):

    def get_customers_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        customers = (live_data or {}).get("customers", [])
        if not customers:
            customers = [
                {"id": "cust-001", "name": "Global Tech Corp", "outstandingBalance": 180000, "creditLimit": 500000, "city": "Mumbai"},
                {"id": "cust-002", "name": "Vanguard Enterprises", "outstandingBalance": 130000, "creditLimit": 300000, "city": "Bengaluru"},
                {"id": "cust-003", "name": "Horizon Solutions", "outstandingBalance": 0, "creditLimit": 200000, "city": "Pune"}
            ]
        currency = getattr(context, "currency_symbol", "₹")
        return {
            "total_customers": len(customers),
            "customers": [
                {
                    **c,
                    "formatted_outstanding": f"{currency}{c.get('outstandingBalance', 0):,.2f}"
                }
                for c in customers
            ]
        }

    def get_customer_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        search_name = args.get("customer_name_or_id", "").lower()
        res = get_customers_handler(args, context, live_data)
        custs = res.get("customers", [])
        found = [c for c in custs if search_name in c.get("name", "").lower() or search_name in c.get("id", "").lower()]
        if found:
            return {"found": True, "customer": found[0]}
        return {"found": False, "message": f"Customer '{args.get('customer_name_or_id')}' not found."}

    def get_overdue_customers_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        res = get_customers_handler(args, context, live_data)
        overdue = [c for c in res.get("customers", []) if c.get("outstandingBalance", 0) > 0]
        currency = getattr(context, "currency_symbol", "₹")
        total_overdue = sum(c.get("outstandingBalance", 0) for c in overdue)

        return {
            "overdue_count": len(overdue),
            "total_overdue_amount": total_overdue,
            "formatted_total_overdue": f"{currency}{total_overdue:,.2f}",
            "overdue_customers": overdue
        }

    def get_customer_balance_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        c_res = get_customer_handler(args, context, live_data)
        if c_res.get("found"):
            cust = c_res["customer"]
            bal = cust.get("outstandingBalance", 0)
            currency = getattr(context, "currency_symbol", "₹")
            return {
                "customer_name": cust.get("name"),
                "outstanding_balance": bal,
                "formatted_balance": f"{currency}{bal:,.2f}"
            }
        return c_res

    registry.register(
        name="get_customers",
        description="Retrieve customer list, debtors, and contact terms.",
        input_schema={},
        output_schema={"total_customers": "int", "customers": "list"},
        permission=Permission.MANAGE_CUSTOMERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_customers_handler
    )

    registry.register(
        name="get_customer",
        description="Fetch customer record by name or account ID.",
        input_schema={"customer_name_or_id": "str"},
        output_schema={"found": "bool", "customer": "dict"},
        permission=Permission.MANAGE_CUSTOMERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_customer_handler
    )

    registry.register(
        name="get_overdue_customers",
        description="Retrieve list of customers with overdue outstanding receivables balance.",
        input_schema={},
        output_schema={"overdue_count": "int", "total_overdue_amount": "float"},
        permission=Permission.MANAGE_CUSTOMERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_overdue_customers_handler
    )

    registry.register(
        name="get_customer_balance",
        description="Fetch outstanding ledger balance for a specific customer.",
        input_schema={"customer_name_or_id": "str"},
        output_schema={"customer_name": "str", "outstanding_balance": "float"},
        permission=Permission.MANAGE_CUSTOMERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_customer_balance_handler
    )
