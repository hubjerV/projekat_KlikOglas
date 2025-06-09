from sqlmodel import SQLModel
from models.admin import Admin
from database import engine

print("Kreiram tabele u bazi...")
SQLModel.metadata.create_all(engine)
print("Gotovo.")
