#repositories/oglas.oy
from sqlmodel import select, Session
from models.postavi_oglas_b import Oglas

def get_oglas_by_id(session: Session, oglas_id: int):
    statement = select(Oglas).where(Oglas.id == oglas_id).options(
        selectinload(Oglas.korisnik)  # važno: učitaj relaciju
    )
    return session.exec(statement).first()
