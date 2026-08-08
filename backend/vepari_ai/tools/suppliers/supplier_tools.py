from typing import Dict, Any, Optional, List
from ...security.permissions import Permission, RiskLevel

def register_supplier_tools(registry):

    def get_suppliers_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        suppliers = (live_data or {}).get("suppliers", [])
        if not suppliers:
            suppliers = [
                {"id": "supp-001", "name": "ABC Industrial Suppliers", "outstandingBalance": 125000, "city": "Thane"},
                {"id": "supp-002", "name": "Precision Tools India Ltd", "outstandingBalance": 70000, "city": "Pune"},
                {"id": "supp-003", "name": "Apex Raw Materials", "outstandingBalance": 0, "city": "Ahmedabad"}
            ]
        currency = getattr(context, "currency_symbol", "₹")
        return {
            "total_suppliers": len(suppliers),
            "suppliers": [
                {
                    **s,
                    "formatted_outstanding": f"{currency}{s.get('outstandingBalance', 0):,.2f}"
                }
                for s in suppliers
            ]
        }

    def get_supplier_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        search_name = args.get("supplier_name_or_id", "").lower()
        res = get_suppliers_handler(args, context, live_data)
        supps = res.get("suppliers", [])
        found = [s for s in supps if search_name in s.get("name", "").lower() or search_name in s.get("id", "").lower()]
        if found:
            return {"found": True, "supplier": found[0]}
        return {"found": False, "message": f"Supplier '{args.get('supplier_name_or_id')}' not found."}

    def get_supplier_balance_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        s_res = get_supplier_handler(args, context, live_data)
        if s_res.get("found"):
            supp = s_res["supplier"]
            bal = supp.get("outstandingBalance", 0)
            currency = getattr(context, "currency_symbol", "₹")
            return {
                "supplier_name": supp.get("name"),
                "outstanding_balance": bal,
                "formatted_balance": f"{currency}{bal:,.2f}"
            }
        return s_res

    def get_overdue_payables_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        res = get_suppliers_handler(args, context, live_data)
        overdue = [s for s in res.get("suppliers", []) if s.get("outstandingBalance", 0) > 0]
        currency = getattr(context, "currency_symbol", "₹")
        total_overdue = sum(s.get("outstandingBalance", 0) for s in overdue)

        return {
            "overdue_supplier_count": len(overdue),
            "total_overdue_payables": total_overdue,
            "formatted_total_payables": f"{currency}{total_overdue:,.2f}",
            "overdue_suppliers": overdue
        }

    registry.register(
        name="get_suppliers",
        description="Retrieve list of vendors, creditors, and trade suppliers.",
        input_schema={},
        output_schema={"total_suppliers": "int", "suppliers": "list"},
        permission=Permission.MANAGE_SUPPLIERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_suppliers_handler
    )

    registry.register(
        name="get_supplier",
        description="Fetch vendor record by supplier name or ID.",
        input_schema={"supplier_name_or_id": "str"},
        output_schema={"found": "bool", "supplier": "dict"},
        permission=Permission.MANAGE_SUPPLIERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_supplier_handler
    )

    registry.register(
        name="get_supplier_balance",
        description="Fetch outstanding payable ledger balance for a specific supplier.",
        input_schema={"supplier_name_or_id": "str"},
        output_schema={"supplier_name": "str", "outstanding_balance": "float"},
        permission=Permission.MANAGE_SUPPLIERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_supplier_balance_handler
    )

    registry.register(
        name="get_overdue_payables",
        description="Fetch list of pending supplier invoices and creditors requiring payment.",
        input_schema={},
        output_schema={"overdue_supplier_count": "int", "total_overdue_payables": "float"},
        permission=Permission.MANAGE_SUPPLIERS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_overdue_payables_handler
    )
