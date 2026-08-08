import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.api import handle_health, handle_status, handle_chat, handle_command, handle_confirm

class TestApiEndpoints(unittest.TestCase):
    def test_health_endpoint(self):
        res = handle_health()
        self.assertEqual(res["status"], "HEALTHY")

    def test_status_endpoint(self):
        res = handle_status()
        self.assertEqual(res["status"], "ONLINE")

    def test_command_endpoint(self):
        res = handle_command({"command": "Show today's sales."})
        self.assertEqual(res["intent"], "SALES_QUERY")

if __name__ == "__main__":
    unittest.main()
