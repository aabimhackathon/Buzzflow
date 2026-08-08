from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class IntentDatasetSample:
    text: str
    intent: str
    domain: str = "BUSINESS"
    metadata: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "intent": self.intent,
            "domain": self.domain,
            "metadata": self.metadata or {}
        }
