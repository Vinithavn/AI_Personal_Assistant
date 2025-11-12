import requests
from dotenv import load_dotenv 
import os 
load_dotenv()

grok_key = os.getenv("GROKKEY")

def ask_llm(prompt: str, session_id: str):
    url = "https://openrouter.ai/api/v1/chat/completions"
    api_key = grok_key
    payload = {
        "model": "x-ai/grok-4-fast",
        "messages": [{"role": "user", "content": prompt}],
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()["choices"][0]["message"]["content"]

def generate_session_name(first_message: str) -> str:
    """Generate a short, descriptive session name based on the first message"""
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"
        api_key = grok_key
        prompt = f"""Generate a very short (2-5 words) title for a chat conversation that starts with this message: "{first_message}"

Rules:
- Maximum 5 words
- Descriptive and concise
- No quotes or special characters
- Capitalize first letter of each word

Examples:
- "Help me plan a trip" -> "Trip Planning"
- "What's the weather like?" -> "Weather Inquiry"
- "I need coding help" -> "Coding Assistance"

Title:"""
        
        payload = {
            "model": "x-ai/grok-4-fast",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 20
        }
        headers = {"Authorization": f"Bearer {api_key}"}
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        
        if response.status_code == 200:
            title = response.json()["choices"][0]["message"]["content"].strip()
            # Clean up the title
            title = title.replace('"', '').replace("'", '').strip()
            # Limit to 50 characters
            if len(title) > 50:
                title = title[:47] + "..."
            return title if title else "New Chat"
        else:
            return "New Chat"
    except Exception as e:
        print(f"Error generating session name: {e}")
        # Fallback: use first few words of the message
        words = first_message.split()[:4]
        return " ".join(words).capitalize() if words else "New Chat"