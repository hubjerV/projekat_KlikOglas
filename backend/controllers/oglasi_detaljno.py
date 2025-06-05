from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_session
from models.postavi_oglas_b import Oglas

router = APIRouter()

@router.get("/oglasi/{oglas_id}")
def get_oglas(oglas_id: int, db: Session = Depends(get_session)):
    return db.query(Oglas).filter(Oglas.id == oglas_id).first()
