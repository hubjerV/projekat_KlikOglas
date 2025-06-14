from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from models.postavi_oglas_b import Oglas  

class Omiljeni(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    korisnik_id: int = Field(foreign_key="user.id")
    oglas_id: int = Field(foreign_key="oglas.id")

    oglas: Optional[Oglas] = Relationship(back_populates="omiljeni")
