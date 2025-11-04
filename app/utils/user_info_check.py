from app.models.database import UserFact, engine
from sqlmodel import Session, select

def get_user_facts(username: int):
    with Session(engine) as session:
        facts = session.exec(
            select(UserFact).where(UserFact.user_name == username)
        ).all()
        return facts
