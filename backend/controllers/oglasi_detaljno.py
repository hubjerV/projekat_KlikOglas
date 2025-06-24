from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from database import get_session
from models.postavi_oglas_b import Oglas
from auth.oauth2 import get_current_user_optional

router = APIRouter()

@router.get("/oglasi/{id}")
async def get_oglas(
    id: int,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user_optional),
):
    oglas = session.exec(
        select(Oglas)
        .options(selectinload(Oglas.korisnik))
        .where(Oglas.id == id)
    ).first()

    if not oglas:
        raise HTTPException(404, "Oglas nije pronađen")

    je_vlasnik = False
    if current_user and oglas.id_korisnika == current_user.id:
        je_vlasnik = True

    response = oglas.model_dump()  # ili oglas.dict() zavisi od verzije SQLModel
    response['je_vlasnik'] = je_vlasnik

    return response
