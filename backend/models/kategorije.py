from sqlmodel import SQLModel, Field

class Kategorija(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    naziv: str
