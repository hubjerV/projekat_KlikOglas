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
    query = db.query(Oglas).filter(Oglas.arhiviran == False)

    # Sortiraj da se istaknuti oglasi prikazuju prvi
    query = query.order_by(Oglas.istaknut.desc(), Oglas.datum_postavljanja.desc())

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

    oglasi = query.all()
    return [OglasRead.from_orm(o) for o in oglasi]

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


@router.post("/oglasi/istakni/{oglas_id}")
def istakni_oglas(
    oglas_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    oglas = db.query(Oglas).filter(Oglas.id == oglas_id).first()

    if not oglas:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen.")
    
    if oglas.id_korisnika != current_user.id:
        raise HTTPException(status_code=403, detail="Nemate dozvolu za ovaj oglas.")

    if oglas.istaknut:
        raise HTTPException(status_code=400, detail="Oglas je već istaknut.")

    if current_user.findit_tokeni < 50:
        raise HTTPException(status_code=400, detail="Nemate dovoljno FindIt tokena.")

    try:
        # Oduzmi tokene i istakni oglas
        current_user.findit_tokeni -= 50
        oglas.istaknut = True

        db.add(current_user)
        db.add(oglas)
        db.commit()
        db.refresh(oglas)
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Greška na serveru: {str(e)}")

    return {"message": "Oglas je uspješno istaknut."}

