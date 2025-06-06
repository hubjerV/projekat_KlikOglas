from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import report_service
from schemas.report import ReportCreate, ReportOut

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportOut)
def report_oglas(report: ReportCreate, db: Session = Depends(get_db), user_id: int = 1):
    return report_service.report_oglas(db, user_id, report.oglas_id, report.razlog)
