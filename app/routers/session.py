from fastapi import APIRouter, HTTPException
from app.services.session import create_or_get_session, get_session_data, get_sessions_for_user
from app.schemas.session import SessionCreate

router = APIRouter()

@router.get("/get/{session_id}")
def session_data(session_id: str):
    try:
        data = get_session_data(session_id)
        return data
    except Exception as e:
        # Return empty history instead of error for new sessions
        return {"messages": []}

@router.get("/{username}")
def sessions_for_user(username: str):
    sessions = get_sessions_for_user(username)
    # Return empty list instead of 404 when user has no sessions
    if not sessions:
        return {"username": username, "sessions": []}
    return {"username": username, "sessions": sessions}


@router.post("/")
def create_session(body: SessionCreate):
    try:
        sid = create_or_get_session(body.username, body.session_id)
        return {"session_id": sid}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
