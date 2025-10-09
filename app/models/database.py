from sqlmodel import SQLModel,Field, create_engine,Session
from typing import Optional,Dict,Any
import json

class User(SQLModel,table=True):
    id:Optional[int]=Field(default=None, primary_key=True)
    username:str
    password_hash:str

class SessionData(SQLModel,table=True):
    id:Optional[int]=Field(default=None, primary_key=True)
    session_id: str
    user_id:int
    data:Optional[str] = Field(default="{}")

engine = create_engine("sqlite:///./mydb.sqlite",echo=True)
SQLModel.metadata.create_all(engine)
