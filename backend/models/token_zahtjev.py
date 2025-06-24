from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class TokenZahtjev(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    korisnik_id: int = Field(foreign_key="user.id")
    broj_tokena: int
    status: str = Field(default="na čekanju")  # ili "odobreno", "odbijeno"
    datum: datetime = Field(default_factory=datetime.utcnow)
    
    korisnik: Optional["User"] = Relationship(back_populates="zahtjevi")
