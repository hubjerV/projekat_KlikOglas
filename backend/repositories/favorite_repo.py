from sqlmodel import Session, select
from models.favorite import Favorite

def add_favorite(db: Session, user_id: int, oglas_id: int) -> Favorite:
    favorite = Favorite(user_id=user_id, oglas_id=oglas_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

def get_user_favorites(db: Session, user_id: int):
    return db.exec(select(Favorite).where(Favorite.user_id == user_id)).all()
