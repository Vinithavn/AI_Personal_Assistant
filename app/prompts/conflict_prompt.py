prompt = """
Given the current user query: {new_query} and past saved context: {saved_context}, 
 —does the user’s current request contradict or conflict with their previous saved context? Answer only with conflict=yes or conflict=no"""

facts_prompt = """
You are a conflict analyzer for a user preference system. Detect contradictions between 
new user input and their historical facts.

NEW INFORMATION:
{new_facts}

HISTORICAL FACTS:
{old_facts}

TASK:
Identify statements that directly contradict each other on the same topic. Ignore:
- Different ways of saying the same thing
- Clarifications or specifications
- Progressive learning ("I used to think X, now I know Y")

CONFLICT CRITERIA:
Must be direct opposites on the SAME TOPIC:
✓ Conflict: "I like coffee" vs "I hate coffee"
✓ Conflict: "I'm vegetarian" vs "I eat meat"
✗ Not conflict: "I like coffee" vs "I like strong coffee"
✗ Not conflict: "I'm from Delhi" vs "I work in Delhi"

Return ONLY this format (nothing else):

RESPONSE FORMAT:
yes
- conflicting fact 1
- conflicting fact 2

OR:

no
[]
"""