from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlmodel import Session
from database import get_session
from models.user import User
from models.admin import Admin
from schemas.user_schema import UserInfo



SECRET_KEY = "tajna"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, is_admin: bool = False):
    to_encode = data.copy()
    to_encode.update({"is_admin": is_admin}) 
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    from repositories.user import get_user_by_username
    from repositories.admin import get_admin_by_username

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        email: str = payload.get("email")
        is_admin = payload.get("is_admin", False)
        if username is None or email is None:
            raise HTTPException(status_code=401, detail="Nevažeći token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Nevažeći token")

    return UserInfo(username=username, email=email, is_admin=is_admin)
