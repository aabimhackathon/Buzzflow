from typing import Dict, Any, Optional, List
from ...security.permissions import Permission, RiskLevel

def register_business_tools(registry):

    def find_government_schemes_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        business_type = getattr(context, "business_type", "Private Limited Company")
        return {
            "schemes_found": 3,
            "schemes": [
                {
                    "title": "CGTMSE Collateral-Free Credit Guarantee",
                    "category": "MSME Credit",
                    "max_funding": "₹5 Crore",
                    "subsidy_pct": "85% Guarantee",
                    "eligibility": "Micro & Small Manufacturing / Service Enterprises",
                    "source": "Ministry of MSME, Govt of India"
                },
                {
                    "title": "PMEGP Prime Minister Employment Generation Scheme",
                    "category": "Capital Subsidy",
                    "max_funding": "₹50 Lakhs",
                    "subsidy_pct": "35% Subsidy",
                    "eligibility": "New manufacturing units set up by micro-entrepreneurs",
                    "source": "KVIC / Ministry of MSME"
                },
                {
                    "title": "ZED Zero Defect Zero Effect Certification Subsidy",
                    "category": "Quality Certification",
                    "max_funding": "₹5 Lakhs",
                    "subsidy_pct": "80% Subsidy",
                    "eligibility": "Udyam Registered MSMEs",
                    "source": "QCI / MSME"
                }
            ]
        }

    def save_business_memory_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        memory_text = args.get("memory_text", "")
        category = args.get("category", "GENERAL")
        return {
            "saved": True,
            "memory_id": "mem-101",
            "category": category,
            "message": f"Saved business memory: '{memory_text}' under '{category}' category."
        }

    def get_business_memory_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "memories": [
                {"id": "mem-1", "category": "PREFERENCE", "content": "Owner prefers payment vouchers over ₹20,000 to require 5-digit PIN confirmation."},
                {"id": "mem-2", "category": "SUPPLIER_TERMS", "content": "ABC Suppliers grants 30 days credit with 2% early payment discount."}
            ]
        }

    registry.register(
        name="find_government_schemes",
        description="Search official MSME and Govt of India subsidies and schemes relevant to the company.",
        input_schema={},
        output_schema={"schemes_found": "int", "schemes": "list"},
        permission="NONE",
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=find_government_schemes_handler
    )

    registry.register(
        name="save_business_memory",
        description="Persist owner preference or business rule to Vepari AI Memory Engine.",
        input_schema={"memory_text": "str", "category": "str"},
        output_schema={"saved": "bool", "memory_id": "str"},
        permission=Permission.ADMIN,
        risk_level=RiskLevel.WRITE.value,
        confirmation_required=False,
        handler=save_business_memory_handler
    )

    registry.register(
        name="get_business_memory",
        description="Fetch learned business rules and owner preferences from memory engine.",
        input_schema={},
        output_schema={"memories": "list"},
        permission="NONE",
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_business_memory_handler
    )
