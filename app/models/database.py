from sqlmodel import SQLModel,Field, create_engine,Session
from typing import Optional,Dict,Any
import json
from datetime import datetime

class User(SQLModel,table=True):
    id:Optional[int]=Field(default=None, primary_key=True)
    username:str
    password_hash:str

class SessionData(SQLModel,table=True):
    id:Optional[int]=Field(default=None, primary_key=True)
    session_id: str
    user_id:int
    data:Optional[str] = Field(default="{}")
    session_name:Optional[str] = Field(default="New Chat")


class UserFact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_name: str
    fact_type: str  # "preference", "habit", "demographic", etc.
    fact_content: str
    source_message: str     # e.g., chat/interaction
    created_at: datetime = Field(default_factory=datetime.now)

    def to_dict(self):
        """Convert UserFact instance to dictionary"""
        return {
            'id': self.id,
            'user_name': self.user_name,
            'fact_type': self.fact_type,
            'fact_content': self.fact_content,
            'source_message': self.source_message,
            'created_at': self.created_at
        }



import os

# Use /app/data for persistence in Docker
db_path = os.getenv("DATABASE_PATH", "/app/data/mydb.sqlite")
engine = create_engine(f"sqlite:///{db_path}", echo=True)
SQLModel.metadata.create_all(engine)
