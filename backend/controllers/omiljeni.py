from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
#from database import get_db
from database import get_session
from schemas.omiljeni import OmiljeniCreate
from repositories import omiljeni as repo_omiljeni
from models.user import User


omiljeni_router = APIRouter(prefix="/omiljeni", tags=["Omiljeni"])

@omiljeni_router.post("/")
def dodaj_omiljeni_oglas(
    omiljeni: OmiljeniCreate,
    db: Session = Depends(get_session),
    korisnik=Depends(get_current_user)
):
    rezultat = repo_omiljeni.dodaj_omiljeni(db, korisnik.id, omiljeni.oglas_id)
    if rezultat is None:
        raise HTTPException(status_code=400, detail="Oglas je već u omiljenima.")
    return {"message": "Oglas dodat u omiljene"}

@omiljeni_router.get("/")
def prikazi_omiljene(
    db: Session = Depends(get_session),
    korisnik=Depends(get_current_user)
):
    return repo_omiljeni.svi_omiljeni(db, korisnik.id)

@omiljeni_router.delete("/{oglas_id}")
def obrisi_omiljeni_oglas(oglas_id: int, db: Session = Depends(get_session), korisnik: User = Depends(get_current_user)):
    rezultat = repo_omiljeni.obrisi_omiljeni(db, korisnik.id, oglas_id)
    if not rezultat:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen u omiljenima.")
    return {"message": "Oglas uklonjen iz omiljenih."}