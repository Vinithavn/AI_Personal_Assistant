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
from app.services.conflict_detect_update import conflict_check,update_memory
import uuid 
import json
from app.services.session import get_chat_history

router = APIRouter() 

@router.post("/")
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
        
        # Vector DB Query to get the similar memories
        embedding = get_embedding(message) 
        similar = query_similar_messages(embedding, username, session_id)
        similar_text = ". ".join([i[0] for i in similar]) if similar else ""
        similarity_context = f"ADDITIONAL INFORMATION: {similar_text}" if similar_text else ""
        
        #Fetching the chat history
        chat_history = get_chat_history(session_id)
        chat_history = append_chat_interaction(session_id, "user", message)
        recent_messages = "PAST MESSAGES:\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history]) 

        # Fetching the user facts using conflict detector
        new_facts = extract_facts(message, session_id)
        print("NEW FAAACTSS:",new_facts)
        user_facts = user_info_check.get_user_facts(username) 
        user_facts_dict = [fact.to_dict() for fact in user_facts]
        print("FAAACTSS:",user_facts_dict)
        conflict_result = conflict_check(new_facts,user_facts_dict,session_id)
        update_result = update_memory(
            username=username,
            extracted_facts=new_facts,
            conflict_result= conflict_result,
        )
        user_information = f"USER DETAILS: {str(user_facts)}" if user_facts else ""  
        
        # LLM response
        final_query = f"{user_information}\n{similarity_context}\n{recent_messages}"
        response = ask_llm(final_query, session_id)

        # Update the chat history
        append_chat_interaction(session_id, "assistant", response)

        # Update the vector database
        msg_id = f"{username}-{session_id}-{uuid.uuid4()}"
        interaction_text = message+response
        interaction_embedding = get_embedding(interaction_text)
        add_message_embedding(interaction_text, interaction_embedding , username, session_id, msg_id)

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