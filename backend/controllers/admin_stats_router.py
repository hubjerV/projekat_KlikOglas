from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import get_session
from models.user import User
from models.postavi_oglas_b import Oglas

router = APIRouter(prefix="/admin/stats", tags=["Admin - Statistika"])

@router.get("/")
def get_admin_stats(session: Session = Depends(get_session)):
    total_users = session.exec(select(func.count()).select_from(User)).one()
    total_oglasi = session.exec(select(func.count()).select_from(Oglas)).one()
    total_pregledi = session.exec(select(func.sum(Oglas.broj_pregleda))).one() or 0
    prosjecna_posjecenost = round(total_pregledi / total_oglasi, 2) if total_oglasi else 0

    return {
        "broj_korisnika": total_users,
        "broj_oglasa": total_oglasi,
        "ukupno_pregleda": total_pregledi,
        "prosjecna_posjecenost": prosjecna_posjecenost
    }
