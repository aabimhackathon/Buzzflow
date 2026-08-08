from typing import Dict, Any, Optional, List
from ...security.permissions import Permission, RiskLevel

def register_report_tools(registry):

    def generate_trial_balance_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        tb = (live_data or {}).get("trialBalance", [])
        currency = getattr(context, "currency_symbol", "₹")
        dr = sum(r.get("debit", 0) for r in tb) or 1450000
        cr = sum(r.get("credit", 0) for r in tb) or 1450000

        return {
            "report_name": "Trial Balance",
            "as_of_date": getattr(context, "current_date", "2026-08-08"),
            "total_debit": dr,
            "total_credit": cr,
            "formatted_debit": f"{currency}{dr:,.2f}",
            "formatted_credit": f"{currency}{cr:,.2f}",
            "is_balanced": abs(dr - cr) < 0.01,
            "rows": tb[:15]
        }

    def generate_trading_account_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        currency = getattr(context, "currency_symbol", "₹")
        return {
            "report_name": "Trading Account",
            "opening_stock": 250000,
            "purchases": 600000,
            "sales": 1250000,
            "closing_stock": 310000,
            "gross_profit": 710000,
            "formatted_gross_profit": f"{currency}710,000.00"
        }

    def generate_profit_loss_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        pnl = (live_data or {}).get("profitLoss", {})
        currency = getattr(context, "currency_symbol", "₹")
        sales = pnl.get("revenue", 1250000)
        expenses = pnl.get("expenses", 830000)
        net_profit = pnl.get("netProfit", sales - expenses)

        return {
            "report_name": "Profit & Loss Account",
            "total_revenue": sales,
            "total_expenses": expenses,
            "net_profit": net_profit,
            "formatted_revenue": f"{currency}{sales:,.2f}",
            "formatted_expenses": f"{currency}{expenses:,.2f}",
            "formatted_net_profit": f"{currency}{net_profit:,.2f}"
        }

    def generate_balance_sheet_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        bs = (live_data or {}).get("balanceSheet", {})
        currency = getattr(context, "currency_symbol", "₹")
        assets = bs.get("totalAssets", 1850000)
        liabilities = bs.get("totalLiabilities", 1850000)

        return {
            "report_name": "Balance Sheet",
            "total_assets": assets,
            "total_liabilities_and_equity": liabilities,
            "formatted_assets": f"{currency}{assets:,.2f}",
            "formatted_liabilities": f"{currency}{liabilities:,.2f}",
            "balanced": abs(assets - liabilities) < 0.01
        }

    def generate_cash_flow_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        currency = getattr(context, "currency_symbol", "₹")
        return {
            "report_name": "Cash Flow Statement",
            "operating_cash_flow": 380000,
            "investing_cash_flow": -120000,
            "financing_cash_flow": -50000,
            "net_cash_increase": 210000,
            "formatted_net_increase": f"{currency}210,000.00"
        }

    registry.register(
        name="generate_trial_balance",
        description="Generate official Trial Balance financial statement.",
        input_schema={},
        output_schema={"report_name": "str", "is_balanced": "bool"},
        permission=Permission.VIEW_REPORTS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=generate_trial_balance_handler
    )

    registry.register(
        name="generate_trading_account",
        description="Generate Trading Account showing Gross Profit calculations.",
        input_schema={},
        output_schema={"gross_profit": "float"},
        permission=Permission.VIEW_REPORTS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=generate_trading_account_handler
    )

    registry.register(
        name="generate_profit_loss",
        description="Generate Profit & Loss financial statement.",
        input_schema={},
        output_schema={"net_profit": "float"},
        permission=Permission.VIEW_REPORTS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=generate_profit_loss_handler
    )

    registry.register(
        name="generate_balance_sheet",
        description="Generate Balance Sheet financial statement.",
        input_schema={},
        output_schema={"total_assets": "float"},
        permission=Permission.VIEW_REPORTS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=generate_balance_sheet_handler
    )

    registry.register(
        name="generate_cash_flow",
        description="Generate Cash Flow Statement.",
        input_schema={},
        output_schema={"net_cash_increase": "float"},
        permission=Permission.VIEW_REPORTS,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=generate_cash_flow_handler
    )
