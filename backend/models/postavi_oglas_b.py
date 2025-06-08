from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from sqlalchemy import Column, Numeric
from decimal import Decimal
from sqlalchemy import JSON
from typing import List

class Oglas(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    naslov: str = Field(nullable=False)
    opis: Optional[str] = Field(default=None, index=True)
    slike: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    cijena: Optional[Decimal] = Field(default=None, sa_column=Column(Numeric(10, 2)))
    lokacija: Optional[str] = Field(default=None)
    kontakt: Optional[str] = Field(default=None)
    kategorija: str = Field(nullable=False)
    datum_postavljanja: Optional[datetime] = Field(default_factory=datetime.utcnow)
    id_korisnika: Optional[int] = Field(default=None, foreign_key="user.id")
  
