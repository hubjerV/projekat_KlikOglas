from sqlalchemy.orm import Session
from models.omiljeni import Omiljeni
from models.postavi_oglas_b import Oglas

def dodaj_omiljeni(db: Session, korisnik_id: int, oglas_id: int):
    # Provjera da li je već dodan
    postoji = db.query(Omiljeni).filter_by(korisnik_id=korisnik_id, oglas_id=oglas_id).first()
    if postoji:
        return None
    novi = Omiljeni(korisnik_id=korisnik_id, oglas_id=oglas_id)
    db.add(novi)
    db.commit()
    db.refresh(novi)
    return novi

def svi_omiljeni(db: Session, korisnik_id: int):
    return db.query(Oglas).join(Omiljeni).filter(Omiljeni.korisnik_id == korisnik_id).all()

def obrisi_omiljeni(db: Session, korisnik_id: int, oglas_id: int):
    omiljeni = db.query(Omiljeni).filter_by(korisnik_id=korisnik_id, oglas_id=oglas_id).first()
    if omiljeni:
        db.delete(omiljeni)
        db.commit()
        return True
    return False