# Conflict Detection Feature

## Overview
The AI Personal Assistant now includes conflict detection that alerts users when their new message contradicts previous preferences or history.

## How It Works

### Backend Flow
1. User sends a message
2. System checks for conflicts against:
   - Previous chat history
   - Similar memories from vector store
   - Stored user facts
3. If conflict detected:
   - Returns a JSON response with conflict prompt
   - User must choose "Yes" (override) or "No" (keep old preferences)
4. Based on user choice:
   - **Yes**: Process message with new preferences, ignore old conflicting data
   - **No**: Keep old preferences, return acknowledgment message

### API Response Types

**Normal Response (no conflict):**
```
Content-Type: text/plain
"AI response text here..."
```

**Conflict Detected:**
```json
Content-Type: application/json
{
  "type": "conflict_prompt",
  "message": "Your new message seems to contradict your previous preferences or history. Do you want to override?",
  "options": ["Yes", "No"]
}
```

### API Request Format

```typescript
POST /chat
{
  "session_id": "string",
  "username": "string", 
  "message": "string",
  "override_conflict": boolean | null  // null for initial request
}
```

## Frontend Implementation Example

```typescript
// In your chat component
const [pendingMessage, setPendingMessage] = useState<string | null>(null);
const [showConflictDialog, setShowConflictDialog] = useState(false);

async function handleSendMessage(message: string, overrideConflict?: boolean) {
  try {
    const response = await sendChatMessage(
      sessionId, 
      username, 
      message, 
      overrideConflict
    );
    
    // Check if response is conflict prompt
    if (typeof response === 'object' && response.type === 'conflict_prompt') {
      setPendingMessage(message);
      setShowConflictDialog(true);
      // Show dialog with response.message and response.options
      return;
    }
    
    // Normal text response
    displayMessage(response);
    
  } catch (error) {
    console.error('Chat error:', error);
  }
}

function handleConflictResponse(override: boolean) {
  setShowConflictDialog(false);
  if (pendingMessage) {
    handleSendMessage(pendingMessage, override);
    setPendingMessage(null);
  }
}
```

## Example Dialog Component

```tsx
{showConflictDialog && (
  <div className="conflict-dialog">
    <p>Your new message seems to contradict your previous preferences or history.</p>
    <p>Do you want to override?</p>
    <button onClick={() => handleConflictResponse(true)}>Yes</button>
    <button onClick={() => handleConflictResponse(false)}>No</button>
  </div>
)}
```

## Testing

### Test Case 1: Preference Conflict
1. User: "I love pizza"
2. (System stores this preference)
3. User: "I hate pizza"
4. System: Shows conflict prompt
5. User selects "Yes" → New preference stored
6. User selects "No" → Old preference kept

### Test Case 2: No Conflict
1. User: "I love pizza"
2. User: "What's the weather?"
3. System: Normal response (no conflict)

## Configuration

The conflict detection prompt can be customized in:
```
app/prompts/conflict_prompt.py
```

Current prompt:
```python
prompt = """
Given the current query: {query} and context: {past_messages}, 
and considering these similar memories:{memories} and user facts: {facts},
—does the user's current request contradict or conflict with their 
previous preferences/history? Answer only with conflict=yes or conflict=no
"""
```

## Notes
- Conflict detection only triggers on the first request (when `override_conflict` is `None`)
- The system uses LLM to intelligently detect semantic conflicts, not just keyword matching
- User's choice is not stored; each new potentially conflicting message will prompt again
