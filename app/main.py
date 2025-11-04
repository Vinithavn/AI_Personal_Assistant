from fastapi import FastAPI
from app.routers import auth, session, chat

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(session.router, prefix="/session", tags=["session"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])

#uvicorn app.main:app --reload

