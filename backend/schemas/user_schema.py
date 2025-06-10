from pydantic import BaseModel

class UserInfo(BaseModel):
    username: str
    email: str
    is_admin: bool
