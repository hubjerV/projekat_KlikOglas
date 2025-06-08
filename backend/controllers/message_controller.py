from fastapi import APIRouter, Depends
from sqlmodel import Session
from models.user import User
from database import get_session
from repositories import message_repository
from schemas.message_schemas import MessageCreate, MessageRead
from typing import List
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from sqlmodel import Session
from database import get_session
from models.user import User
import os
from jose import JWTError


SECRET_KEY = os.getenv("SECRET_KEY", "tajna")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    from repositories.user import get_user_by_username  # ✅ dodaj ovde

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Nevažeći token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Nevažeći token")

    user = get_user_by_username(session, username)
    if user is None:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji")
    return user


@router.post("/messages/", response_model=MessageRead)
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return message_repository.create_message(db, message, current_user.id)

@router.get("/messages/{oglas_id}", response_model=List[MessageRead])
def get_messages(oglas_id: int, db: Session = Depends(get_session)):
    return message_repository.get_messages_by_oglas(db, oglas_id)

@router.get("/messages/chat/{oglas_id}", response_model=List[MessageRead])
def get_chat_for_oglas(
    oglas_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return message_repository.get_chat_for_oglas(db, oglas_id, current_user.id)


@router.get("/chat/{oglas_id}", response_model=List[MessageRead])
def get_chat(
    oglas_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    message_repository.mark_as_read(db, oglas_id, current_user.id)
    return message_repository.get_chat_for_oglas(db, oglas_id, current_user.id)


@router.get("/messages/unread-count", response_model=int)
def get_unread_count(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return message_repository.count_unread_messages(db, current_user.id)


