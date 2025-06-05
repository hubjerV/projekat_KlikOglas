# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from database import get_session

# from models.postavi_oglas_b import Oglas


# router = APIRouter()

# @router.get("/oglasi")
# def get_all_oglasi(db: Session = Depends(get_session)):
#     return db.query(Oglas).all()

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_session
from models.postavi_oglas_b import Oglas
from datetime import datetime

router = APIRouter()

@router.get("/oglasi")
def get_filtered_oglasi(
    db: Session = Depends(get_session),
    search: Optional[str] = None,
    kategorija: Optional[str] = None,
    lokacija: Optional[str] = None,
    min_cijena: Optional[float] = None,
    max_cijena: Optional[float] = None,
    datum: Optional[str] = None  # format: "2024-06-01"
):
    query = db.query(Oglas)

    if search:
        query = query.filter(Oglas.naslov.ilike(f"%{search}%") | Oglas.opis.ilike(f"%{search}%"))
    if kategorija:
        query = query.filter(Oglas.kategorija == kategorija)
    if lokacija:
        query = query.filter(Oglas.lokacija == lokacija)
    if min_cijena:
        query = query.filter(Oglas.cijena >= min_cijena)
    if max_cijena:
        query = query.filter(Oglas.cijena <= max_cijena)
    if datum:
        try:
            datum_dt = datetime.strptime(datum, "%Y-%m-%d")
            query = query.filter(Oglas.datum_postavljanja >= datum_dt)
        except ValueError:
            pass  # ignorisati ako nije validan datum

    return query.all()
