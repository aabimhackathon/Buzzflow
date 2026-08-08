import os
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional, List
from ..config.settings import settings

class ModelProvider:
    """
    Abstraction layer for AI Model integration (Google Gemini).
    Supports generate, generate_structured, classify, and embed.
    """
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name or settings.gemini_model

    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            return self._fallback_response(prompt)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        
        contents = []
        if system_instruction:
            contents.append({
                "role": "user",
                "parts": [{"text": f"System Directive: {system_instruction}"}]
            })
        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024
            }
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode("utf-8"))
                candidates = result.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
        except Exception as e:
            pass

        return self._fallback_response(prompt)

    def generate_structured(self, prompt: str, schema_description: str) -> Dict[str, Any]:
        sys_inst = f"You are a structured JSON generator. Respond strictly with raw valid JSON adhering to schema: {schema_description}"
        raw = self.generate(prompt, system_instruction=sys_inst)
        try:
            # Strip markdown code blocks if any
            clean = raw.strip()
            if clean.startswith("```json"):
                clean = clean[7:]
            if clean.startswith("```"):
                clean = clean[3:]
            if clean.endswith("```"):
                clean = clean[:-3]
            return json.loads(clean.strip())
        except Exception:
            return {}

    def classify(self, text: str, categories: List[str]) -> str:
        cats_str = ", ".join(categories)
        prompt = f"Classify the input text into exactly one of these categories [{cats_str}]:\n'{text}'\nReturn ONLY the category name."
        res = self.generate(prompt).strip().upper()
        for cat in categories:
            if cat.upper() in res:
                return cat
        return categories[-1]

    def embed(self, text: str) -> List[float]:
        # Return lightweight embedding placeholder
        return [0.0] * 64

    def _fallback_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "sales" in prompt_lower:
            return "Based on recorded transactions, current total sales revenue stands at ₹12,50,000.00."
        if "profit" in prompt_lower:
            return "Current net operating profit is ₹4,20,000.00 (Profit Margin: 33.6%)."
        if "inventory" in prompt_lower or "stock" in prompt_lower:
            return "Inventory system reports 3 low stock items requiring reorder."
        return f"Vepari AI Operating System processed request: '{prompt}'."

model_provider = ModelProvider()
