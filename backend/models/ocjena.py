from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime


class Ocjena(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ocjenjivac_id: int = Field(foreign_key="user.id")  # Ko daje ocjenu
    korisnik_id: int = Field(foreign_key="user.id")    # Kome se daje ocjena
    ocjena: int = Field(ge=1, le=5)
    komentar: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
