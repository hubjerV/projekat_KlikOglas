from sqlmodel import Session, select
from models.user import User
from schemas.user import UserCreate

def get_user_by_username(session: Session, username: str):
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def create_user(session: Session, user_create: UserCreate, hashed_password: str):
    user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
