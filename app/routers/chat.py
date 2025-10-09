from fastapi import APIRouter,HTTPException
from app.services.llm import ask_llm
from app.services.session import append_chat_interaction

router = APIRouter() 

@router.post("/")
def chat(session_id: str, content: str):
    try:
        chat_history = append_chat_interaction(session_id, "user", content)
        query  = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
        print(query)
        response = ask_llm(query, session_id)
        chat_history = append_chat_interaction(session_id, "assistant", response)
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
