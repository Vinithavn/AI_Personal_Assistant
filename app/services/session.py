from app.models.database import User,SessionData,engine
from sqlmodel import Session as DBSession,select
import json
import uuid


def create_or_get_session(username: str, session_id: str = None, data: dict = None) -> str:
    data = data or {}
    with DBSession(engine) as db:
        # Find user ID
        print([u.username for u in db.exec(select(User)).all()])

        user = db.exec(select(User).where(User.username == username)).first()
        if not user:
            raise ValueError("User not found")
        # If session_id is provided, try to reuse
        if session_id:
            session = db.exec(select(SessionData).where(SessionData.session_id == session_id)).first()
            if session:
                return session.session_id
        # Otherwise, create a new session
        new_session_id = str(uuid.uuid4())
        session = SessionData(
            session_id=new_session_id,
            user_id=user.id,
            data=json.dumps(data)
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session.session_id

    
def get_session_data(session_id: str):
    with DBSession(engine) as db:
        session = db.exec(select(SessionData).where(SessionData.session_id == session_id)).first()
        if not session:
            # Return empty chat history for new sessions instead of None
            return {"messages": []}
        
        chat_data = json.loads(session.data) if session.data else []
        
        # Ensure it's a list
        if not isinstance(chat_data, list):
            chat_data = []
        
        # Return in the expected format
        return {"messages": chat_data}


def get_sessions_for_user(username: str):
    with DBSession(engine) as db:
        user = db.exec(select(User).where(User.username == username)).first()
        if not user:
            return []
        sessions = db.exec(select(SessionData).where(SessionData.user_id == user.id)).all()
        return [session.session_id for session in sessions]



def append_chat_interaction(session_id: str, role: str, content: str):
    with DBSession(engine) as db:
        session = db.exec(select(SessionData).where(SessionData.session_id == session_id)).first()
        if not session:
            raise ValueError("Session not found")
        chat_history = json.loads(session.data) if session.data else []
        if not isinstance(chat_history, list):
            chat_history = []
        chat_history = chat_history[-10:]
        chat_history.append({"role": role, "content": content})
        session.data = json.dumps(chat_history)
        db.add(session)
        db.commit()
        db.refresh(session)
        return chat_history
