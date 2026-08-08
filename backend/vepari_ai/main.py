import json
import sys
import os
import http.server
import socketserver
from urllib.parse import urlparse

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../.."))

from backend.vepari_ai.config.settings import settings
from backend.vepari_ai.api import handle_health, handle_status, handle_chat, handle_command, handle_confirm

class VepariAiRequestHandler(http.server.BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, data: dict):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ["/api/v1/health", "/health"]:
            return self._send_json(200, handle_health())

        if path in ["/api/v1/ai/status", "/status"]:
            return self._send_json(200, handle_status())

        return self._send_json(404, {"error": f"Endpoint GET {path} not found."})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON body"})

        try:
            if path in ["/api/v1/ai/chat", "/api/ai/chat"]:
                res = handle_chat(body)
                return self._send_json(200, res)

            if path in ["/api/v1/ai/command", "/api/ai/command", "/api/ai/orchestrate"]:
                res = handle_command(body)
                return self._send_json(200, res)

            if path in ["/api/v1/ai/confirm", "/api/ai/confirm"]:
                res = handle_confirm(body)
                return self._send_json(200, res)

            return self._send_json(404, {"error": f"Endpoint POST {path} not found."})
        except Exception as e:
            return self._send_json(500, {"error": f"Internal server error: {str(e)}"})

def run_server(port: int = 8000):
    handler = VepariAiRequestHandler
    print(f"Starting {settings.app_name} HTTP Service on port {port}...")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        print(f"Vepari AI Core active on http://127.0.0.1:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else settings.port
    run_server(port)
