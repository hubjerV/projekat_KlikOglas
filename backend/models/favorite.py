from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class Favorite(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    oglas_id: int = Field(foreign_key="oglas.id")
