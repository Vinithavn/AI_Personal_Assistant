from app.prompts import conflict_prompt
from app.services import llm

def conflict_check(user_query: str, context: list, memories: str, facts: str, session_id: str) -> str:
    """
    Check if the user's current message conflicts with their previous preferences/history.
    
    Returns:
        str: "yes" if conflict detected, "no" otherwise
    """
    # Format context as string if it's a list
    if isinstance(context, list):
        context_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in context])
    else:
        context_str = str(context)
    
    conflict_detected = conflict_prompt.prompt.format(
        query=user_query,
        past_messages=context_str,
        memories=memories,
        facts=facts
    )
    
    response = llm.ask_llm(conflict_detected, session_id)
    
    # Clean the response
    clean_response = response.replace("conflict=", "").replace("CONFLICT DETECTED:", "")
    clean_response = clean_response.strip().lower()
    
    # Return just "yes" or "no"
    if "yes" in clean_response:
        return "yes"
    else:
        return "no"