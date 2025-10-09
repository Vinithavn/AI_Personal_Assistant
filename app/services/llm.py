import requests
from dotenv import load_dotenv 
import os 
load_dotenv()

grok_key = os.getenv("GROKKEY")
def ask_llm(prompt:str,session_id:str):
    url = "https://openrouter.ai/api/v1/chat/completions"
    api_key = grok_key
    payload = {
        "model": "x-ai/grok-4-fast",
        "messages": [{"role": "user", "content": prompt}],
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()["choices"][0]["message"]["content"]