from pydantic import BaseModel
from typing import Optional

class SessionCreate(BaseModel):
    username: str
    session_id: Optional[str] = None
