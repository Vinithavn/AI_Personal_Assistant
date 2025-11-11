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


class UserFact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_name: str
    fact_type: str  # "preference", "habit", "demographic", etc.
    fact_content: str
    source_message: str     # e.g., chat/interaction
    created_at: datetime = Field(default_factory=datetime.now)



import os

# Use /app/data for persistence in Docker
db_path = os.getenv("DATABASE_PATH", "/app/data/mydb.sqlite")
engine = create_engine(f"sqlite:///{db_path}", echo=True)
SQLModel.metadata.create_all(engine)
