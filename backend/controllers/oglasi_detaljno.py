from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_session
from models.postavi_oglas_b import Oglas
from schemas.oglas_schema import OglasRead

router = APIRouter()

# @router.get("/oglasi/{oglas_id}")
# def get_oglas(oglas_id: int, db: Session = Depends(get_session)):
#     return db.query(Oglas).filter(Oglas.id == oglas_id).first()

@router.get("/oglasi/{oglas_id}", response_model=OglasRead)  # ✅ koristi response_model
def get_oglas(oglas_id: int, db: Session = Depends(get_session)):
    return db.query(Oglas).filter(Oglas.id == oglas_id).first()