from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, session, chat
from app.models.database import User, engine
from sqlmodel import Session as DBSession, select

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including OPTIONS
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(session.router, prefix="/session", tags=["session"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])

# Debug endpoint to list all users (remove in production!)
@app.get("/debug/users")
def list_users():
    with DBSession(engine) as db:
        users = db.exec(select(User)).all()
        return {"users": [{"id": u.id, "username": u.username} for u in users]}

#uvicorn app.main:app --reload

