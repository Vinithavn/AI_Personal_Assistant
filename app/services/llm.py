import requests
grok_key = "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"

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