from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime

@dataclass
class BusinessContext:
    company_id: str = "comp-001"
    company_name: str = "My Enterprise"
    financial_year: str = "2025-2026"
    business_type: str = "Private Limited Company"
    user_id: str = "usr-owner"
    user_role: str = "owner"  # owner, accountant, manager, staff
    permissions: List[str] = field(default_factory=lambda: [
        "VIEW_REPORTS", "POST_VOUCHER", "MANAGE_INVENTORY", 
        "MANAGE_CUSTOMERS", "MANAGE_SUPPLIERS", "ADMIN"
    ])
    currency: str = "INR"
    currency_symbol: str = "₹"
    current_date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    current_time: str = field(default_factory=lambda: datetime.now().strftime("%H:%M:%S"))
    current_page: str = "vepari-ai"
    recent_conversation: List[Dict[str, Any]] = field(default_factory=list)
    relevant_memory: List[Dict[str, Any]] = field(default_factory=list)
    recent_business_events: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "company_id": self.company_id,
            "company_name": self.company_name,
            "financial_year": self.financial_year,
            "business_type": self.business_type,
            "user_id": self.user_id,
            "user_role": self.user_role,
            "permissions": self.permissions,
            "currency": self.currency,
            "currency_symbol": self.currency_symbol,
            "current_date": self.current_date,
            "current_time": self.current_time,
            "current_page": self.current_page,
            "recent_conversation": self.recent_conversation,
            "relevant_memory": self.relevant_memory,
            "recent_business_events": self.recent_business_events
        }

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> "BusinessContext":
        if not data:
            return cls()
        return cls(
            company_id=data.get("company_id") or data.get("id") or "comp-001",
            company_name=data.get("company_name") or data.get("name") or "My Enterprise",
            financial_year=data.get("financial_year") or "2025-2026",
            business_type=data.get("business_type") or data.get("entityType") or "Private Limited Company",
            user_id=data.get("user_id") or "usr-owner",
            user_role=data.get("user_role") or "owner",
            permissions=data.get("permissions") or [
                "VIEW_REPORTS", "POST_VOUCHER", "MANAGE_INVENTORY", 
                "MANAGE_CUSTOMERS", "MANAGE_SUPPLIERS", "ADMIN"
            ],
            currency=data.get("currency") or "INR",
            currency_symbol=data.get("currency_symbol") or data.get("currencySymbol") or "₹",
            current_date=data.get("current_date") or datetime.now().strftime("%Y-%m-%d"),
            current_time=data.get("current_time") or datetime.now().strftime("%H:%M:%S"),
            current_page=data.get("current_page") or "vepari-ai",
            recent_conversation=data.get("recent_conversation") or [],
            relevant_memory=data.get("relevant_memory") or [],
            recent_business_events=data.get("recent_business_events") or []
        )
