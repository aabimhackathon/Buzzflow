import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.core.orchestrator import orchestrator

class TestOrchestrator(unittest.TestCase):
    def test_sales_command(self):
        res = orchestrator.process_command("Show today's sales.")
        self.assertEqual(res.intent, "SALES_QUERY")
        self.assertIn("Verified Total Sales Revenue", res.message)

    def test_low_stock_command(self):
        res = orchestrator.process_command("Which products are low?")
        self.assertEqual(res.intent, "INVENTORY_QUERY")

    def test_voucher_posting_requires_confirmation(self):
        res = orchestrator.process_command("Post payment voucher for ₹25,000")
        self.assertTrue(res.requires_confirmation)
        self.assertIsNotNone(res.confirmation_id)

if __name__ == "__main__":
    unittest.main()
