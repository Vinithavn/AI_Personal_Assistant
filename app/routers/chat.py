from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse, PlainTextResponse
from app.services.llm import ask_llm, generate_session_name
from app.services.session import append_chat_interaction, update_session_name, is_first_message
from app.services.vector_store import add_message_embedding, query_similar_messages
from app.services.extract_facts import extract_facts
from app.models.database import UserFact, engine, Session
from app.utils.embeddings import get_embedding
from app.utils import user_info_check
from app.schemas.chat import ChatMessage
from app.services.conflict_detector import conflict_check
import uuid 
import json



router = APIRouter() 

@router.post("/")
def chat(body: ChatMessage):
    session_id = body.session_id
    username = body.username
    message = body.message
    override_conflict = body.override_conflict
    
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
        
        # Get context for conflict detection
        embedding = get_embedding(message) 
        similar = query_similar_messages(embedding, username, session_id)
        similar_text = ". ".join([i[0] for i in similar]) if similar else ""
        
        # Get chat history (before adding current message)
        from app.services.session import get_chat_history
        chat_history = get_chat_history(session_id)
        
        user_facts = user_info_check.get_user_facts(username)
        
        # Check for conflicts only if this is the first request (no override decision yet)
        if override_conflict is None:
            conflict_result = conflict_check(message, chat_history, similar_text, user_facts, session_id)
            
            # If conflict detected, return prompt to user
            if conflict_result.lower().strip() == "yes":
                return JSONResponse(
                    status_code=200,
                    content={
                        "type": "conflict_prompt",
                        "message": "Your new message seems to contradict your previous preferences or history. Do you want to override?",
                        "options": ["Yes", "No"]
                    }
                )
        
        # If user chose "No" to override, return early
        if override_conflict is False:
            response = "I'll keep your previous preferences in mind. How else can I help you?"
            append_chat_interaction(session_id, "user", message)
            append_chat_interaction(session_id, "assistant", response)
            return PlainTextResponse(content=response)
        
        # Continue with normal processing (no conflict or user chose to override)
        # Store the facts if any
        facts = extract_facts(message, session_id)
        print("FACTS:", facts)
        with Session(engine) as db:
            for fact in facts:
                if fact.get('fact_content') is not None and fact.get('source_message') is not None:
                    db.add(UserFact(
                        user_name=username,
                        fact_type=fact.get('fact_type'),
                        fact_content=fact.get('fact_content'),
                        source_message=fact.get('source_message')
                    ))
                    db.commit() 
        
        msg_id = f"{username}-{session_id}-{uuid.uuid4()}"
        add_message_embedding(message, embedding, username, session_id, msg_id)
        
        similarity_context = f"ADDITIONAL INFORMATION: {similar_text}" if similar_text else ""
        
        # Add current message to history
        chat_history = append_chat_interaction(session_id, "user", message)
        recent_messages = "PAST MESSAGES:\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history]) 

        user_information = f"USER DETAILS: {str(user_facts)}" if user_facts else ""
        
        # Build final query based on conflict override
        if override_conflict is True:
            # User wants to override - use only recent context, ignore old facts
            final_query = f"{recent_messages}\n\nNote: User is updating their preferences. Prioritize this new information."
        else:
            # No conflict or normal flow
            final_query = f"{user_information}\n{similarity_context}\n{recent_messages}"

        response = ask_llm(final_query, session_id)
        append_chat_interaction(session_id, "assistant", response)

        return PlainTextResponse(content=response)
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Chat error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process chat message: {str(e)}")



@router.get("/userfacts")
def get_user_facts(username: str):
    with Session(engine) as db:

        facts = user_info_check.get_user_facts(username)
        return facts  # If SQLModel, you can use .dict()