#models/postavi_oglas_b.py
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy import Column, Numeric, JSON
from decimal import Decimal
#from models.user import User  # ← dodaj import
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.user import User

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
    broj_pregleda: int = Field(default=0)
    arhiviran: bool = Field(default=False)

    omiljeni: List["Omiljeni"] = Relationship(back_populates="oglas")

    # 🔽 Dodajemo vezu ka User tabeli:
    korisnik: Optional["User"] = Relationship(back_populates="oglasi")  # ← NOVO
