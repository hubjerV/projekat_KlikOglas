from sqlmodel import Session
from models.report import Report

def report_ad(db: Session, user_id: int, oglas_id: int, razlog: str) -> Report:
    report = Report(user_id=user_id, oglas_id=oglas_id, razlog=razlog)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
