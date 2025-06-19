from sqlmodel import Session, select
from models.ocjena import Ocjena
from schemas.ocjena import OcjenaCreate
from fastapi import HTTPException

'''
def create_ocjena(session: Session, ocjena_data: OcjenaCreate, ocjenjivac_id: int):
    ocjena = Ocjena(
        ocjenjivac_id=ocjenjivac_id,
        korisnik_id=ocjena_data.korisnik_id,
        ocjena=ocjena_data.ocjena,
        komentar=ocjena_data.komentar
    )
    session.add(ocjena)
    session.commit()
    session.refresh(ocjena)
    return ocjena

'''

def create_ocjena(session: Session, ocjena_data: OcjenaCreate, ocjenjivac_id: int):
    # Provjeri da li je korisnik već ocijenjen
    existing = session.exec(
        select(Ocjena).where(
            (Ocjena.korisnik_id == ocjena_data.korisnik_id) &
            (Ocjena.ocjenjivac_id == ocjenjivac_id)
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Već ste ocijenili ovog korisnika.")

    # Ako nije, nastavi sa dodavanjem ocjene
    ocjena = Ocjena(
        ocjenjivac_id=ocjenjivac_id,
        korisnik_id=ocjena_data.korisnik_id,
        ocjena=ocjena_data.ocjena,
        komentar=ocjena_data.komentar
    )
    session.add(ocjena)
    session.commit()
    session.refresh(ocjena)
    return ocjena

def get_ocjene_for_user(session: Session, korisnik_id: int):
    return session.exec(select(Ocjena).where(Ocjena.korisnik_id == korisnik_id)).all()