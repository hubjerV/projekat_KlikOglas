from sqlmodel import Session
from repositories import favorite_repo

def add_favorite(db: Session, user_id: int, oglas_id: int):
    return favorite_repo.add_favorite(db, user_id, oglas_id)

def get_favorites(db: Session, user_id: int):
    return favorite_repo.get_user_favorites(db, user_id)
