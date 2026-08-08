from .registry import tool_registry, ToolRegistry, ToolDefinition
from .accounting import register_accounting_tools
from .inventory import register_inventory_tools
from .customers import register_customer_tools
from .suppliers import register_supplier_tools
from .reports import register_report_tools
from .navigation import register_navigation_tools
from .business import register_business_tools

def init_all_tools(registry=None):
    reg = registry or tool_registry
    register_accounting_tools(reg)
    register_inventory_tools(reg)
    register_customer_tools(reg)
    register_supplier_tools(reg)
    register_report_tools(reg)
    register_navigation_tools(reg)
    register_business_tools(reg)
    return reg

# Initialize global default registry
init_all_tools(tool_registry)

__all__ = [
    "tool_registry",
    "ToolRegistry",
    "ToolDefinition",
    "init_all_tools"
]
