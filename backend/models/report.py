from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    oglas_id: int = Field(foreign_key="oglas.id")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    razlog: str = Field(nullable=False)
    datum: datetime = Field(default_factory=datetime.utcnow)
