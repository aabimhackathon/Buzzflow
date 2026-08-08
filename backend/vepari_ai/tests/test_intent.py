import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.core.intent import intent_detector

class TestIntentDetector(unittest.TestCase):
    def test_example_queries(self):
        cases = [
            ("Show today's sales.", "SALES_QUERY"),
            ("How much profit did I make this month?", "PROFIT_QUERY"),
            ("Which products are low?", "INVENTORY_QUERY"),
            ("Show customers who haven't paid.", "CUSTOMER_QUERY"),
            ("Create a payment voucher for ₹25,000 to ABC Suppliers.", "VOUCHER_CREATE"),
            ("Validate this voucher.", "VOUCHER_VALIDATE"),
            ("Find government schemes for my business.", "GOVERNMENT_SCHEME"),
            ("Why did profit fall this month?", "BUSINESS_ANALYSIS")
        ]
        for query, expected in cases:
            res = intent_detector.detect(query)
            self.assertEqual(res["intent"], expected, f"Failed for query '{query}'")

    def test_entity_extraction(self):
        res = intent_detector.detect("Create a payment voucher for ₹25,000 to ABC Suppliers.")
        self.assertEqual(res["entities"].get("amount"), 25000.0)
        self.assertIn("ABC Suppliers", res["entities"].get("party_name", ""))

if __name__ == "__main__":
    unittest.main()
