from pydantic import BaseModel

class FavoriteCreate(BaseModel):
    oglas_id: int

class FavoriteOut(BaseModel):
    id: int
    oglas_id: int
    user_id: int

    class Config:
        orm_mode = True
