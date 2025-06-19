from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

class OglasKorisnik(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class OglasRead(BaseModel):
    id: int
    naslov: str
    opis: Optional[str]
    slike: Optional[List[str]]
    cijena: Optional[Decimal]
    lokacija: Optional[str]
    kontakt: Optional[str]
    kategorija: str
    datum_postavljanja: datetime
    id_korisnika: Optional[int] = None
    broj_pregleda: int

    # ✅ Dodaj info o korisniku koji je objavio oglas
    korisnik: Optional[OglasKorisnik] = None

    class Config:
        from_attributes = True
