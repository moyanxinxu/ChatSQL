from typing import Any, Dict

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str
    config: Dict[str, Any] = Field(default_factory=dict)
    meta: Dict[str, Any] = Field(default_factory=dict)
