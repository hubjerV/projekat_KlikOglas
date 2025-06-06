from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    oglas_id: int
    razlog: str

class ReportOut(BaseModel):
    id: int
    oglas_id: int
    user_id: int
    razlog: str
    datum: datetime

    class Config:
        orm_mode = True
