import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.security import check_permission, Permission, confirmation_manager, RiskLevel

class TestSecurity(unittest.TestCase):
    def test_permissions(self):
        self.assertTrue(check_permission("owner", Permission.ADMIN))
        self.assertTrue(check_permission("accountant", Permission.POST_VOUCHER))
        self.assertFalse(check_permission("staff", Permission.POST_VOUCHER))

    def test_confirmation_required(self):
        self.assertTrue(confirmation_manager.is_confirmation_required("FINANCIAL_WRITE"))
        self.assertTrue(confirmation_manager.is_confirmation_required("DESTRUCTIVE"))
        self.assertFalse(confirmation_manager.is_confirmation_required("READ"))
        self.assertFalse(confirmation_manager.is_confirmation_required("DRAFT"))

    def test_pending_confirmation_flow(self):
        conf_id = confirmation_manager.create_pending_confirmation(
            tool_name="post_voucher",
            tool_args={"amount": 25000},
            summary="Post payment of 25000",
            company_id="comp-001",
            user_id="usr-owner",
            risk_level="FINANCIAL_WRITE"
        )
        self.assertIsNotNone(confirmation_manager.get_pending_confirmation(conf_id))
        resolved = confirmation_manager.resolve_confirmation(conf_id, "APPROVED")
        self.assertEqual(resolved["status"], "APPROVED")

if __name__ == "__main__":
    unittest.main()
