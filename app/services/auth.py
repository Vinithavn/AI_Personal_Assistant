from sqlmodel import Session as DBSession, select
from app.models.database import User, engine
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def signup(username: str, password: str):
    with DBSession(engine) as db:
        existing = db.exec(select(User).where(User.username == username)).first()
        if existing:
            raise ValueError("User exists")
        user = User(username=username, password_hash=hash_password(password))
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

def verify_login(username: str, password: str):
    with DBSession(engine) as db:
        user = db.exec(select(User).where(User.username == username)).first()
        if user is None or user.password_hash != hash_password(password):
            return False
        return True

