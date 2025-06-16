from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PrijavaCreate(BaseModel):
    oglas_id: int
    razlog: str

class PrijavaRead(BaseModel):
    id: int
    oglas_id: int
    korisnik_id: int
    razlog: str
    vrijeme_prijave: datetime
    status: Optional[str] = "na čekanju"

    class Config:
        from_attributes = True  # nova verzija umjesto orm_mode = True
