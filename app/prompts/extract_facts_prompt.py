PROMPT = """
Given the following user message:
\"\"\"{user_message}\"\"\"

Identify any user facts, preferences, habits, or personal details expressed. For each fact, return:
- fact_type (name, age,preference, habit, location, expertise, hobby, etc.)
- fact_content (the specific information or value)
- source_message (the relevant span from the message)

If no facts are found, return an empty list.

Format your response as a JSON array like this:
[
    {{
        "fact_type": "...",
        "fact_content": "...",
        "source_message": "..."
    }},
    ...
]
"""
