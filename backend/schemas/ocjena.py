from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OcjenaCreate(BaseModel):
    korisnik_id: int
    ocjena: int = Field(ge=1, le=5)
    komentar: Optional[str] = None


class OcjenaRead(BaseModel):
    id: int
    ocjenjivac_id: int
    korisnik_id: int
    ocjena: int
    komentar: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
