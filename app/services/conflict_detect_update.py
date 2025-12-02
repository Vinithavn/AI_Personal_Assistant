from typing import List, Dict, Tuple
from dataclasses import dataclass
from app.prompts import conflict_prompt
from app.services import llm
from app.services.extract_facts import extract_facts
from app.models.database import UserFact, engine, Session


@dataclass
class ConflictResult:
    has_conflict: bool
    conflicting_facts: List[str]
    raw_response: str


def parse_conflict_response(response: str) -> ConflictResult:
    """
    Parse LLM response to extract conflict status and conflicting facts.
    
    Expected response format:
    - If conflict: "yes\n- fact1\n- fact2"
    - If no conflict: "no\n[]" or "no"
    """
    lines = response.strip().split('\n')
    has_conflict = lines[0].lower().strip() == 'yes'
    
    conflicting_facts = []
    if has_conflict and len(lines) > 1:
        # Extract facts from list format
        for line in lines[1:]:
            fact = line.strip().lstrip('- ').strip()
            if fact and fact != '[]':
                conflicting_facts.append(fact)
    
    return ConflictResult(
        has_conflict=has_conflict,
        conflicting_facts=conflicting_facts,
        raw_response=response
    )


def conflict_check(
    new_facts: str, 
    old_facts: str, 
    session_id: str
) -> ConflictResult:
    """
    Check if the user's current message conflicts with their previous preferences/history.
    
    Args:
        new_facts: New information from user
        old_facts: Previously stored facts
        session_id: User session identifier
    
    Returns:
        ConflictResult with conflict status and conflicting facts
    """
    
    conflict_prompt_text = conflict_prompt.facts_prompt.format(
        new_facts=new_facts,
        old_facts=old_facts,
    )
    
    response = llm.ask_llm(conflict_prompt_text, session_id)
    result = parse_conflict_response(response)
    
    return result


def update_memory(
    username: str,
    extracted_facts: List[Dict],
    conflict_result: ConflictResult,
    update_strategy: str = "merge"
) -> Dict[str, any]:
    """
    Update SQLite based on conflict detection results.
    
    Args:
        username: Username to update facts for
        extracted_facts: List of fact dictionaries with 'fact_content', 'fact_type', 'source_message'
        conflict_result: Result from conflict_check()
        update_strategy: 
            - "merge": Keep both old and new (default)
            - "replace": Replace conflicting facts with new ones
            - "manual_review": Flag for manual review, don't auto-update
    
    Returns:
        Dict with update status and details
    """
    
    if not conflict_result.has_conflict:
        # No conflict: straightforward addition
        return _add_new_facts(username, extracted_facts)
    
    # Handle conflicts based on strategy
    if update_strategy == "replace":
        
        return _replace_conflicting_facts(
            username, 
            extracted_facts, 
            conflict_result.conflicting_facts
        )
    elif update_strategy == "merge":
        return _merge_facts(
            username, 
            extracted_facts, 
            conflict_result.conflicting_facts
        )
    else:
        raise ValueError(f"Unknown update strategy: {update_strategy}")


def _add_new_facts(
    username: str, 
    extracted_facts: List[Dict]
) -> Dict[str, any]:
    """Add new facts without conflicts."""
    try:
        with Session(engine) as db:
            added_facts = []
            for fact in extracted_facts:
                if fact.get('fact_content') is not None and fact.get('source_message') is not None:
                    user_fact = UserFact(
                        user_name=username,
                        fact_type=fact.get('fact_type'),
                        fact_content=fact.get('fact_content'),
                        source_message=fact.get('source_message')
                    )
                    db.add(user_fact)
                    added_facts.append(user_fact)
            
                    db.commit()
        
        return {
            "status": "success",
            "action": "added",
            "facts":str(extracted_facts),
            "facts_count": len(added_facts),
            "message": f"Added {len(added_facts)} new facts successfully"
        }
    except Exception as e:
        return {
            "function":"add new",
            "status": "error",
            "action": "failed",
            "message": str(e)
        }


def _replace_conflicting_facts(
    username: str,
    extracted_facts: List[Dict],
    conflicting_facts: List[str]
) -> Dict[str, any]:
    """Replace old conflicting facts with new ones."""
    try:
        with Session(engine) as db:
            # Find and delete old conflicting facts
            for old_fact in conflicting_facts:
                db.query(UserFact).filter(
                    UserFact.user_name == username,
                    UserFact.fact_content.contains(old_fact)
                ).delete()
            
            # Add new facts
            added_facts = []
            for fact in extracted_facts:
                if fact.get('fact_content') is not None and fact.get('source_message') is not None:
                    user_fact = UserFact(
                        user_name=username,
                        fact_type=fact.get('fact_type'),
                        fact_content=fact.get('fact_content'),
                        source_message=fact.get('source_message')
                    )
                    db.add(user_fact)
                    added_facts.append(user_fact)
            
            db.commit()
        
        return {
            "status": "success",
            "action": "replaced",
            "new_facts_count": len(added_facts),
            "superseded_facts": conflicting_facts,
            "message": f"Replaced {len(conflicting_facts)} conflicting fact(s) with {len(added_facts)} new fact(s)"
        }
    except Exception as e:
        return {
            "function":"replace conflicting",
            "status": "error",
            "action": "failed",
            "message": str(e)
        }


def _merge_facts(
    username: str,
    extracted_facts: List[Dict],
    conflicting_facts: List[str]
) -> Dict[str, any]:
    """
    Keep both old and new facts but keep track of which ones conflict.
    Useful when preferences evolve over time.
    """
    try:
        with Session(engine) as db:
            # Add new facts alongside old ones (no deletion)
            added_facts = []
            for fact in extracted_facts:
                if fact.get('fact_content') is not None and fact.get('source_message') is not None:
                    user_fact = UserFact(
                        user_name=username,
                        fact_type=fact.get('fact_type'),
                        fact_content=fact.get('fact_content'),
                        source_message=fact.get('source_message')
                    )
                    db.add(user_fact)
                    added_facts.append(user_fact)
            
            db.commit()
        
        return {
            "status": "success",
            "action": "merged",
            "new_facts_count": len(added_facts),
            "conflicting_facts_kept": conflicting_facts,
            "message": f"Added {len(added_facts)} new fact(s); kept conflicting facts for context"
        }
    except Exception as e:
        return {
            "function":"merging",
            "status": "error",
            "action": "failed",
            "message": str(e)
        }




