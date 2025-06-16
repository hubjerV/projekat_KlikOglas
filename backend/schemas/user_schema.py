from pydantic import BaseModel
from typing import Optional

class UserInfo(BaseModel):
    username: str
    email: str
    is_admin: bool
    id: int


class UserUpdate(BaseModel):
    username:Optional[str]=None
    email:Optional[str]=None
    id:Optional[str]=None