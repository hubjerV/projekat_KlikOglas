from sqlmodel import Session, select
from models.user import User
from schemas.user import UserCreate, UserUpdate
from services.auth import hash_password


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.exec(select(User).where(User.id == user_id)).first()

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

def update_user(session, user, update_data):
    if update_data.username:
        user.username = update_data.username
    if update_data.email:
        user.email = update_data.email
    if update_data.password:
        from services.auth import hash_password
        user.hashed_password = hash_password(update_data.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user