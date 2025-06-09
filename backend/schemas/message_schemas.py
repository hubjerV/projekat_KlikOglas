from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageCreate(BaseModel):
    receiver_id: int
    oglas_id: int
    content: str

class MessageRead(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    oglas_id: int
    content: str
    timestamp: datetime
    sender_username: Optional[str] = None

    class Config:
        orm_mode = True
