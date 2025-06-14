'''
from sqlmodel import create_engine
#ovaj deo nije gootv mora da se spoji na bazu!!


# Podaci za konekciju
DATABASE_USER = "postgres"  # tvoje korisničko ime
DATABASE_PASSWORD = "lozinka"  # tvoja lozinka
DATABASE_HOST = "localhost"  # ili IP adresa servera
DATABASE_PORT = "5432"  # podrazumevani port za PostgreSQL
DATABASE_NAME = "moja_baza"  # naziv baze podataka

# URL za konekciju na PostgreSQL
postgresql_url = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

# Kreiranje engine objekta za SQLModel
engine = create_engine(postgresql_url)
'''
from sqlmodel import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker



DATABASE_URL = "postgresql://postgres:lozinka@localhost:5432/moja_baza"

#engine = create_engine(DATABASE_URL, echo=True)
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

'''
def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
'''

def get_session():
    with Session(engine) as session:
        yield session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

