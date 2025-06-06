from sqlmodel import Session
from repositories import report_repo

def report_oglas(db: Session, user_id: int, oglas_id: int, razlog: str):
    return report_repo.report_ad(db, user_id, oglas_id, razlog)
