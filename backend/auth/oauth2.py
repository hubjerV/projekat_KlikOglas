import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlmodel import Session
from database import get_session
from models.user import User
from typing import Optional

# Učitaj .env varijable
load_dotenv()

# Sigurne varijable iz .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

print("SECRET_KEY =", SECRET_KEY)
print("ALGORITHM =", ALGORITHM)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Standardni OAuth2PasswordBearer koji baca 401 ako nema token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# --- Nova klasa: OAuth2PasswordBearerOptional ---

class OAuth2PasswordBearerOptional(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        authorization: Optional[str] = request.headers.get("Authorization")
        if not authorization:
            return None  # Nema headera - vrati None, ne baca 401
        return await super().__call__(request)


oauth2_scheme_optional = OAuth2PasswordBearerOptional(tokenUrl="auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user: User) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    from repositories.user import get_user_by_id  # VAŽNO: koristi user ID

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Nevažeći token")
    except JWTError as e:
        print("JWT error:", e)
        raise HTTPException(status_code=401, detail="Nevažeći token")

    user = get_user_by_id(session, int(user_id))
    if user is None:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji")
    return user


def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Samo admini mogu pristupiti.")
    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    session: Session = Depends(get_session)
) -> Optional[User]:
    from repositories.user import get_user_by_id

    if token is None:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None
    except Exception:
        return None

    return get_user_by_id(session, int(user_id))
