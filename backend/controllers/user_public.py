from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.user import User

router = APIRouter()

@router.get("/user/{username}", response_model=User)
def get_user_by_username_route(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji")
    return user
