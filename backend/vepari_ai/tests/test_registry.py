import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.tools import tool_registry
from backend.vepari_ai.models.context import BusinessContext

class TestToolRegistry(unittest.TestCase):
    def test_tool_registration(self):
        tools = tool_registry.list_tools()
        names = [t["name"] for t in tools]
        self.assertIn("get_sales", names)
        self.assertIn("get_expenses", names)
        self.assertIn("get_profit", names)
        self.assertIn("create_voucher_draft", names)
        self.assertIn("post_voucher", names)

    def test_execute_tool(self):
        ctx = BusinessContext()
        res = tool_registry.execute_tool("get_sales", {"period": "month"}, ctx)
        self.assertTrue(res["success"])
        self.assertIn("sales_total", res["data"])

if __name__ == "__main__":
    unittest.main()
