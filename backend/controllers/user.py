from fastapi import APIRouter, Depends, HTTPException, Security
from sqlmodel import Session
from database import get_session
from schemas.user import UserCreate, UserLogin, UserRead, UserUpdate
from repositories.user import get_user_by_username, create_user
from services.auth import hash_password, verify_password, create_access_token, get_current_user
from models.user import User
from typing import List
from sqlmodel import select
from repositories.user import update_user
from models.admin import Admin  # dodaj ovo



router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    if get_user_by_username(session, user.username):
        raise HTTPException(status_code=400, detail="Korisnik već postoji")
    hashed_pw = hash_password(user.password)
    new_user = create_user(session, user, hashed_pw)
    return new_user



@router.post("/login")
def login(user: UserLogin, session: Session = Depends(get_session)):
    db_user = get_user_by_username(session, user.username)
    if db_user and verify_password(user.password, db_user.hashed_password):
        token = create_access_token(
        {"sub": db_user.username, "email": db_user.email, "id": db_user.id},
        is_admin=False)

        return {"access_token": token, "token_type": "bearer"}

    admin = session.exec(select(Admin).where(Admin.username == user.username)).first()
    if admin and verify_password(user.password, admin.hashed_password):
        token = create_access_token(
            {"sub": admin.username, "email": admin.email, "id": admin.id},
            is_admin=True
)

        return {"access_token": token, "token_type": "bearer"}

    # 3. Ako nijedno nije prošlo
    raise HTTPException(status_code=401, detail="Neispravni podaci")



@router.get("/users", response_model=List[UserRead])
def list_users(session: Session = Depends(get_session)):
    return session.exec(select(User)).all()

@router.put("/profile/update", response_model=UserRead)
def update_profile(
    update_data: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    updated_user = update_user(session, current_user, update_data)
    return updated_user


