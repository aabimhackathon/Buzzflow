from enum import Enum
from typing import List, Dict, Any

class RiskLevel(Enum):
    READ = "READ"
    DRAFT = "DRAFT"
    WRITE = "WRITE"
    FINANCIAL_WRITE = "FINANCIAL_WRITE"
    DESTRUCTIVE = "DESTRUCTIVE"

class Permission:
    VIEW_REPORTS = "VIEW_REPORTS"
    POST_VOUCHER = "POST_VOUCHER"
    MANAGE_INVENTORY = "MANAGE_INVENTORY"
    MANAGE_CUSTOMERS = "MANAGE_CUSTOMERS"
    MANAGE_SUPPLIERS = "MANAGE_SUPPLIERS"
    ADMIN = "ADMIN"

ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "owner": [
        Permission.VIEW_REPORTS,
        Permission.POST_VOUCHER,
        Permission.MANAGE_INVENTORY,
        Permission.MANAGE_CUSTOMERS,
        Permission.MANAGE_SUPPLIERS,
        Permission.ADMIN
    ],
    "accountant": [
        Permission.VIEW_REPORTS,
        Permission.POST_VOUCHER,
        Permission.MANAGE_INVENTORY,
        Permission.MANAGE_CUSTOMERS,
        Permission.MANAGE_SUPPLIERS
    ],
    "manager": [
        Permission.VIEW_REPORTS,
        Permission.MANAGE_INVENTORY,
        Permission.MANAGE_CUSTOMERS,
        Permission.MANAGE_SUPPLIERS
    ],
    "staff": [
        Permission.VIEW_REPORTS
    ]
}

def check_permission(user_role: str, required_permission: str) -> bool:
    if not required_permission or required_permission == "NONE":
        return True
    user_perms = ROLE_PERMISSIONS.get(user_role.lower(), ROLE_PERMISSIONS["staff"])
    return required_permission in user_perms or Permission.ADMIN in user_perms
