import re
from typing import Dict, Any, List, Optional
from .provider import model_provider

class IntentDetector:
    INTENTS = [
        "GENERAL_CONVERSATION",
        "BUSINESS_BRIEF",
        "SALES_QUERY",
        "EXPENSE_QUERY",
        "PROFIT_QUERY",
        "LEDGER_QUERY",
        "INVENTORY_QUERY",
        "CUSTOMER_QUERY",
        "SUPPLIER_QUERY",
        "REPORT_QUERY",
        "VOUCHER_CREATE",
        "VOUCHER_VALIDATE",
        "VOUCHER_POST",
        "INVOICE_CREATE",
        "NAVIGATION",
        "SEARCH",
        "GOVERNMENT_SCHEME",
        "MARKET_INFORMATION",
        "BUSINESS_ANALYSIS",
        "MEMORY_QUERY",
        "MEMORY_SAVE",
        "AUTOMATION_QUERY",
        "UNKNOWN"
    ]

    def detect(self, user_input: str, current_page: Optional[str] = None) -> Dict[str, Any]:
        inp = user_input.strip().lower()
        
        # Extract entities (amount, party, period, product)
        entities = self._extract_entities(user_input)

        if any(k in inp for k in ["trial balance", "balance sheet", "profit and loss", "p&l", "trading account"]):
            return {"intent": "REPORT_QUERY", "confidence": 0.95, "entities": entities}

        if inp.startswith("open ") or any(k in inp for k in ["navigate to", "go to ", "show page", "show view"]):
            return {"intent": "NAVIGATION", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["post voucher", "post payment", "confirm voucher", "post this"]):
            return {"intent": "VOUCHER_POST", "confidence": 0.98, "entities": entities}

        if any(k in inp for k in ["validate voucher", "validate this", "check voucher", "validate"]):
            return {"intent": "VOUCHER_VALIDATE", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["payment voucher", "draft voucher", "create voucher", "make voucher", "pay ₹", "payment of ₹", "pay rs"]):
            return {"intent": "VOUCHER_CREATE", "confidence": 0.98, "entities": entities}

        if any(k in inp for k in ["why did", "why has", "fall", "drop", "trend", "analysis", "health index", "diagnostic"]):
            return {"intent": "BUSINESS_ANALYSIS", "confidence": 0.92, "entities": entities}

        if any(k in inp for k in ["sale", "sales", "revenue", "turnover", "income"]):
            return {"intent": "SALES_QUERY", "confidence": 0.96, "entities": entities}

        if any(k in inp for k in ["profit", "margin", "net income"]):
            return {"intent": "PROFIT_QUERY", "confidence": 0.96, "entities": entities}

        if any(k in inp for k in ["expense", "cost", "spending", "purchases", "expenses"]):
            return {"intent": "EXPENSE_QUERY", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["low stock", "inventory", "stock", "products", "sku"]):
            return {"intent": "INVENTORY_QUERY", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["customer", "debtor", "receivables", "clients", "haven't paid", "who owes"]):
            return {"intent": "CUSTOMER_QUERY", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["supplier", "vendor", "creditor", "payables", "bills due"]):
            return {"intent": "SUPPLIER_QUERY", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["reports", "financial statement"]):
            return {"intent": "REPORT_QUERY", "confidence": 0.95, "entities": entities}

        if any(k in inp for k in ["government", "scheme", "subsidy", "msme", "cgtmse", "pmegp"]):
            return {"intent": "GOVERNMENT_SCHEME", "confidence": 0.96, "entities": entities}

        if any(k in inp for k in ["why did", "trend", "analysis", "health index", "diagnostic"]):
            return {"intent": "BUSINESS_ANALYSIS", "confidence": 0.92, "entities": entities}

        if any(k in inp for k in ["remember", "save rule", "preference"]):
            return {"intent": "MEMORY_SAVE", "confidence": 0.92, "entities": entities}

        if any(k in inp for k in ["memory", "what did i store", "rules"]):
            return {"intent": "MEMORY_QUERY", "confidence": 0.92, "entities": entities}

        if any(k in inp for k in ["briefing", "overview", "summary", "morning update"]):
            return {"intent": "BUSINESS_BRIEF", "confidence": 0.90, "entities": entities}

        # Fallback to model classifier
        classified = model_provider.classify(user_input, self.INTENTS)
        return {"intent": classified, "confidence": 0.85, "entities": entities}

    def _extract_entities(self, text: str) -> Dict[str, Any]:
        entities = {}
        # Amount extraction (₹25,000 or Rs 25000 or 25000)
        amt_match = re.search(r'(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)', text, re.IGNORECASE)
        if amt_match:
            try:
                raw_amt = amt_match.group(1).replace(',', '')
                if float(raw_amt) > 0:
                    entities["amount"] = float(raw_amt)
            except ValueError:
                pass

        # Party extraction ("to ABC Suppliers", "for Global Tech")
        party_match = re.search(r'(?:to|from)\s+([A-Za-z0-9\s&]+)', text, re.IGNORECASE)
        if party_match:
            party_str = party_match.group(1).rstrip('.').strip()
            if party_str and not party_str.lower().startswith("the") and len(party_str) > 1:
                entities["party_name"] = party_str
        else:
            party_match_for = re.search(r'for\s+([A-Za-z0-9\s&]+)', text, re.IGNORECASE)
            if party_match_for:
                p_str = party_match_for.group(1).rstrip('.').strip()
                if p_str and not re.search(r'^[\d,\.₹\$]+$', p_str):
                    entities["party_name"] = p_str

        # Period extraction ("today", "this month", "this year")
        if "today" in text.lower():
            entities["period"] = "today"
        elif "this month" in text.lower() or "month" in text.lower():
            entities["period"] = "month"
        elif "year" in text.lower():
            entities["period"] = "year"

        return entities

intent_detector = IntentDetector()
