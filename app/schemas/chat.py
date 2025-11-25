from pydantic import BaseModel
from typing import Optional

class ChatMessage(BaseModel):
    session_id: str
    username: str
    message: str
    override_conflict: Optional[bool] = None  # User's response to conflict prompt
