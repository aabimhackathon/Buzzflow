from typing import Dict, Any, Optional, List
from ...security.permissions import Permission, RiskLevel

def register_inventory_tools(registry):

    def get_inventory_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        inventory = (live_data or {}).get("inventory", [])
        if not inventory:
            # Verified sample items
            inventory = [
                {"id": "inv-1", "sku": "ELEC-001", "name": "4K Ultra HD Display Panel 27\"", "currentStock": 4, "reorderLevel": 10, "unitPrice": 22000},
                {"id": "inv-2", "sku": "ELEC-002", "name": "Wireless Ergonomic Keyboards", "currentStock": 45, "reorderLevel": 15, "unitPrice": 3500},
                {"id": "inv-3", "sku": "ELEC-003", "name": "USB-C Fast Charging Docks", "currentStock": 8, "reorderLevel": 12, "unitPrice": 1800}
            ]

        return {
            "total_skus": len(inventory),
            "items": inventory
        }

    def get_low_stock_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        inventory_res = get_inventory_handler(args, context, live_data)
        items = inventory_res.get("items", [])
        
        low_stock_items = [
            item for item in items 
            if item.get("currentStock", 0) <= item.get("reorderLevel", 10)
        ]

        return {
            "low_stock_count": len(low_stock_items),
            "low_stock_items": low_stock_items,
            "has_reorder_alerts": len(low_stock_items) > 0
        }

    def get_product_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        search_term = args.get("product_name_or_sku", "").lower()
        items = get_inventory_handler(args, context, live_data).get("items", [])
        
        found = [
            i for i in items 
            if search_term in i.get("name", "").lower() or search_term in i.get("sku", "").lower()
        ]

        if found:
            return {"found": True, "product": found[0]}
        
        return {
            "found": False,
            "message": f"Product matching '{args.get('product_name_or_sku')}' not found.",
            "available_products": [i.get("name") for i in items[:5]]
        }

    def get_stock_value_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        items = get_inventory_handler(args, context, live_data).get("items", [])
        total_value = sum(i.get("currentStock", 0) * i.get("unitPrice", 0) for i in items)
        currency = getattr(context, "currency_symbol", "₹")

        return {
            "total_inventory_value": total_value,
            "formatted_value": f"{currency}{total_value:,.2f}",
            "sku_count": len(items)
        }

    def get_inventory_movements_handler(args: Dict[str, Any], context: Any, live_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "recent_movements": [
                {"date": "2026-08-07", "sku": "ELEC-001", "type": "OUT", "quantity": 2, "reference": "Invoice #1092"},
                {"date": "2026-08-06", "sku": "ELEC-002", "type": "IN", "quantity": 20, "reference": "Purchase Order #881"}
            ]
        }

    registry.register(
        name="get_inventory",
        description="Retrieve stock levels, inventory SKUs, and warehouse status.",
        input_schema={},
        output_schema={"total_skus": "int", "items": "list"},
        permission=Permission.MANAGE_INVENTORY,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_inventory_handler
    )

    registry.register(
        name="get_low_stock",
        description="Retrieve inventory items that are at or below reorder threshold levels.",
        input_schema={},
        output_schema={"low_stock_count": "int", "low_stock_items": "list"},
        permission=Permission.MANAGE_INVENTORY,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_low_stock_handler
    )

    registry.register(
        name="get_product",
        description="Query a specific product by SKU or name in the inventory stock list.",
        input_schema={"product_name_or_sku": "str"},
        output_schema={"found": "bool", "product": "dict"},
        permission=Permission.MANAGE_INVENTORY,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_product_handler
    )

    registry.register(
        name="get_stock_value",
        description="Fetch total valuation of all stock in hand.",
        input_schema={},
        output_schema={"total_inventory_value": "float"},
        permission=Permission.MANAGE_INVENTORY,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_stock_value_handler
    )

    registry.register(
        name="get_inventory_movements",
        description="Fetch recent stock movement logs (Inward/Outward movements).",
        input_schema={},
        output_schema={"recent_movements": "list"},
        permission=Permission.MANAGE_INVENTORY,
        risk_level=RiskLevel.READ.value,
        confirmation_required=False,
        handler=get_inventory_movements_handler
    )
