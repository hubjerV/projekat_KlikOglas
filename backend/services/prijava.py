from sqlmodel import Session
from models.prijava import PrijavaOglasa
from schemas.prijava import PrijavaCreate
from datetime import datetime
from sqlmodel import select

def kreiraj_prijavu(session: Session, prijava: PrijavaCreate, korisnik_id: int) -> PrijavaOglasa:
    nova_prijava = PrijavaOglasa(
        oglas_id=prijava.oglas_id,
        korisnik_id=korisnik_id,
        razlog=prijava.razlog,
        vrijeme_prijave=datetime.utcnow(),
        status="na čekanju"
    )
    session.add(nova_prijava)
    session.commit()
    session.refresh(nova_prijava)
    return nova_prijava

def dohvati_sve_prijave(session: Session) -> list[PrijavaOglasa]:
    return session.exec(
        select(PrijavaOglasa)
    ).all()
