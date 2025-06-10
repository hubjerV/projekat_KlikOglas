from sqlmodel import Session
from models.admin import Admin

def get_admin_by_username(session: Session, username: str) -> Admin | None:
    return session.query(Admin).filter(Admin.username == username).first()
