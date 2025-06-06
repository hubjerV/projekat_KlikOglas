from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from services import favorite_service
from schemas.favorite import FavoriteCreate, FavoriteOut
from typing import List

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.post("/", response_model=FavoriteOut)
def add_favorite(
    fav: FavoriteCreate,
    db: Session = Depends(get_db),
    user_id: int = Query(...)
):
    return favorite_service.add_favorite(db, user_id, fav.oglas_id)

@router.get("/", response_model=List[FavoriteOut])
def get_user_favorites(
    db: Session = Depends(get_db),
    user_id: int = Query(...)
):
    return favorite_service.get_favorites(db, user_id)
