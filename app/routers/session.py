from fastapi import APIRouter,Depends
from fastapi import APIRouter, HTTPException
from app.services.session import create_or_get_session,get_session_data,get_sessions_for_user

router = APIRouter()

@router.get("/get/{session_id}")
def session_data(session_id: str):
    return get_session_data(session_id)

@router.get("/{username}")
def sessions_for_user(username: str):
    session_ids = get_sessions_for_user(username)
    if not session_ids:
        raise HTTPException(status_code=404, detail="No sessions found or user does not exist")
    return {"username": username, "session_ids": session_ids}


@router.post("/")
def create_session(username: str, session_id: str = None):
    try:
        sid = create_or_get_session(username, session_id)
        return {"session_id": sid}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
