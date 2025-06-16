from fastapi import APIRouter, Depends
from sqlmodel import Session
from auth.oauth2 import get_current_user
from models.user import User
from database import get_session
from schemas.prijava import PrijavaCreate, PrijavaRead
from services import prijava as prijava_service
from sqlmodel import select
from auth.oauth2 import get_current_admin
from typing import List


router = APIRouter(prefix="/prijava", tags=["Prijava"])

@router.post("/", response_model=PrijavaRead)
def prijavi_oglas(
    prijava: PrijavaCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    return prijava_service.kreiraj_prijavu(session, prijava, user.id)


@router.get("/provjera/{oglas_id}", response_model=bool)
def provjeri_prijavu_oglasa(
    oglas_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    from models.prijava import PrijavaOglasa

    prijava = session.exec(
        select(PrijavaOglasa).where(
            PrijavaOglasa.oglas_id == oglas_id,
            PrijavaOglasa.korisnik_id == user.id
        )
    ).first()

    return prijava is not None



@router.get("/sve", response_model=List[PrijavaRead])
def dohvati_sve_prijave(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)  # samo admin može pristupiti
):
    return prijava_service.dohvati_sve_prijave(session)
