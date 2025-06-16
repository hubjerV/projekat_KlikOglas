from sqlmodel import SQLModel
from database import engine

from models.user import User
from models.postavi_oglas_b import Oglas
from models.prijava import PrijavaOglasa  # nova tabela

SQLModel.metadata.create_all(engine)
