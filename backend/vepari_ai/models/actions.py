from dataclasses import dataclass, field
from typing import Dict, Any, Optional

@dataclass
class UiAction:
    type: str  # NAVIGATE, OPEN_MODAL, SHOW_DATA, REQUEST_CONFIRMATION, DRAWER_OPEN
    target: str
    payload: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "target": self.target,
            "payload": self.payload
        }

    @classmethod
    def navigate(cls, target_tab: str, sub_tab: Optional[str] = None) -> "UiAction":
        return cls(
            type="NAVIGATE",
            target=target_tab,
            payload={"subTab": sub_tab} if sub_tab else {}
        )
