from fastapi import APIRouter, Depends, Request
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlmodel import select
from database import get_session
from models.user import User
from services.auth import create_access_token

router = APIRouter()

config = Config('.env')
oauth = OAuth(config)

oauth.register(
    name='google',
    client_id=config('GOOGLE_CLIENT_ID'),
    client_secret=config('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

@router.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth_google_callback(request: Request, session: Session = Depends(get_session)):
    print("🎯 Callback hit")

    token = await oauth.google.authorize_access_token(request)
    print("✅ Token primljen:", token)

    resp = await oauth.google.get("https://openidconnect.googleapis.com/v1/userinfo", token=token)
    user_info = resp.json()
    print("👤 Google user info:", user_info)

    email = user_info.get("email")
    username = user_info.get("name")

    user = session.exec(select(User).where(User.email == email)).first()

    if not user:
        try:
            user = User(
                username=username,
                email=email,
                hashed_password="google_oauth"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print("🆕 Korisnik dodat")
        except Exception as e:
            print("❌ Greska pri dodavanju korisnika:", e)
            session.rollback()
            raise HTTPException(status_code=500, detail="Greška pri kreiranju korisnika")

    access_token = create_access_token({
        "sub": user.username,
        "email": user.email,
        "id": user.id,
        "is_admin": False
    })

    print("🎫 Access token:", access_token)

    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}", status_code=302)

