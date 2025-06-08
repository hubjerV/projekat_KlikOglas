from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    oglas_id: int = Field(foreign_key="oglas.id")
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    procitana: bool = Field(default=False)
