from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import PlainTextResponse
from app.services.llm import ask_llm, generate_session_name
from app.services.session import append_chat_interaction, update_session_name, is_first_message
from app.services.vector_store import add_message_embedding, query_similar_messages
from app.services.extract_facts import extract_facts
from app.models.database import UserFact, engine, Session
from app.utils.embeddings import get_embedding
from app.utils import user_info_check
from app.schemas.chat import ChatMessage
import uuid 



router = APIRouter() 

@router.post("/", response_class=PlainTextResponse)
def chat(body: ChatMessage):
    session_id = body.session_id
    username = body.username
    message = body.message
    
    try:
        # Check if this is the first message and generate session name
        if is_first_message(session_id):
            try:
                session_name = generate_session_name(message)
                update_session_name(session_id, session_name)
                print(f"Generated session name: {session_name}")
            except Exception as e:
                print(f"Failed to generate session name: {e}")
                # Continue even if name generation fails
        
        # storing the facts if any
        facts = extract_facts(message, session_id)
        print("FACTTTTTTT", facts)
        with Session(engine) as db:
            for fact in facts:
                if fact['fact_content'] is not None and fact['source_message'] is not None:
                    db.add(UserFact(
                        user_name=username,
                        fact_type=fact['fact_type'],
                        fact_content=fact['fact_content'],
                        source_message=fact['source_message']
                    ))
                    db.commit() 
        
        embedding = get_embedding(message) 
        
        msg_id = f"{username}-{session_id}-{uuid.uuid4()}"
        add_message_embedding(message, embedding, username, session_id, msg_id)
        similar = query_similar_messages(embedding, username, session_id)
        similar = ". ".join([i[0] for i in similar])
        similarity_context = f"ADDITIONAL INFORMATION: {similar}"
        
        # Past 5 conversations for the user and session
        chat_history = append_chat_interaction(session_id, "user", message)
        recent_messages = "PAST MESSAGES:" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history]) 

        user_facts = user_info_check.get_user_facts(username)
        
        user_information = f"USER DETAILS:{str(user_facts)}"

        final_query = f"{user_information}\n{similarity_context}\n{recent_messages}"
        print("FINAL QUERY", final_query)
        response = ask_llm(final_query, session_id)
        chat_history = append_chat_interaction(session_id, "assistant", response)

        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process chat message: {str(e)}")



@router.get("/userfacts")
def get_user_facts(username: str):
    with Session(engine) as db:

        facts = user_info_check.get_user_facts(username)
        return facts  # If SQLModel, you can use .dict()