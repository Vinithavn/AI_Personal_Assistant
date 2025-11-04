from app.prompts import extract_facts_prompt
from app.services import llm
import json

def extract_facts(user_message: str,session_id) -> list:
    prompt = extract_facts_prompt.PROMPT.format(user_message=user_message)
    llm_response = llm.ask_llm(prompt,session_id)
    # Parse llm_response as JSON and return
    return json.loads(llm_response)
    
