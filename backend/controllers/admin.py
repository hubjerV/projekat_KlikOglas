from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from database import get_session
from services.auth import get_current_user
from models.admin import Admin

router = APIRouter()

@router.post("/admin/login")
def admin_login(data: dict, session: Session = Depends(get_session)):
    username = data.get("username")
    password = data.get("password")

    admin = session.exec(select(Admin).where(Admin.username == username)).first()
    from services.auth import verify_password, create_access_token
    if not admin or not verify_password(password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Neispravni admin podaci")

    token = create_access_token(
    {"sub": admin.username, "email": admin.email},
    is_admin=True
)


    return {"access_token": token, "token_type": "bearer"}


@router.get("/admin")
def admin_dashboard(current_user=Depends(get_current_user)):
    if getattr(current_user, "username", "") != "admin":
        raise HTTPException(status_code=403, detail="Nemaš pristup")

    return {"message": f"Zdravo, admin {current_user.username}!"}
