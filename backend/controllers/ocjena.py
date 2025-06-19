from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from auth.oauth2 import get_current_user
from schemas.ocjena import OcjenaCreate, OcjenaRead
from repositories import ocjena as repo_ocjena
from typing import List


router = APIRouter(prefix="/ocjene", tags=["Ocjene"])


@router.post("/", response_model=OcjenaRead)
def create_ocjena(
    ocjena_data: OcjenaCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if current_user.id == ocjena_data.korisnik_id:
        raise HTTPException(status_code=400, detail="Ne možeš ocjenjivati sam sebe.")
    return repo_ocjena.create_ocjena(session, ocjena_data, current_user.id)


@router.get("/korisnik/{korisnik_id}", response_model=List[OcjenaRead])
def get_ocjene_for_user(korisnik_id: int, session: Session = Depends(get_session)):
    return repo_ocjena.get_ocjene_for_user(session, korisnik_id)
