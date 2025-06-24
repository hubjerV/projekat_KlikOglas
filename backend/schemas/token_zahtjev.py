# schemas/token_zahtjev.py

from pydantic import BaseModel
from datetime import datetime

class TokenZahtjevCreate(BaseModel):
    broj_tokena: int

class TokenZahtjevRead(BaseModel):
    id: int
    korisnik_id: int
    broj_tokena: int
    status: str
    datum: datetime

    class Config:
        from_attributes = True
