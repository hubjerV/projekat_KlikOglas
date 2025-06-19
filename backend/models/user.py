from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from models.postavi_oglas_b import Oglas
from sqlalchemy.orm import selectinload 

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    hashed_password: str
    is_admin: bool = False

    # 🔽 Dodaj relaciju ka oglasima
    oglasi: List[Oglas] = Relationship(back_populates="korisnik")
