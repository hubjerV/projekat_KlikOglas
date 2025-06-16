from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class PrijavaOglasa(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    oglas_id: int = Field(foreign_key="oglas.id")  # prilagodi ako ti se drugačije zove tabela
    korisnik_id: int = Field(foreign_key="user.id")
    razlog: str
    vrijeme_prijave: datetime
    status: Optional[str] = Field(default="na čekanju")  # ili koristi Enum
