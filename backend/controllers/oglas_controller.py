# controllers/oglas.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List

from database import get_session
from models.postavi_oglas_b import Oglas
from auth.oauth2 import get_current_user, get_current_admin
from models.user import User
from schemas.oglas_schema import OglasRead

router = APIRouter()

@router.get("/oglasi", response_model=List[OglasRead])
def get_filtered_oglasi(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    search: Optional[str] = None,
    kategorija: Optional[str] = None,
    lokacija: Optional[str] = None,
    min_cijena: Optional[float] = None,
    max_cijena: Optional[float] = None,
    datum: Optional[str] = None
):
    query = db.query(Oglas)

    query = query.filter(Oglas.arhiviran == False)

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
            pass

    return query.all()

@router.get("/admin/arhivirani-oglasi", response_model=List[Oglas])
def get_arhivirani_oglasi(
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    return db.query(Oglas).filter(Oglas.arhiviran == True).all()

@router.put("/admin/aktiviraj-oglas/{oglas_id}")
def aktiviraj_oglas(
    oglas_id: int,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    oglas = db.query(Oglas).filter(Oglas.id == oglas_id).first()
    if not oglas:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")

    oglas.arhiviran = False
    db.add(oglas)
    db.commit()
    db.refresh(oglas)
    return {"message": "Oglas je uspješno aktiviran."}

@router.post("/admin/arhiviraj-oglase")
def arhiviraj_manualno(
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    from repositories.arhiviranje import arhiviraj_stare_oglase
    arhiviraj_stare_oglase(db)
    return {"message": "Arhivirani su oglasi stariji od 3 dana."}
