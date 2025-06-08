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
from sqlmodel import create_engine, Session

DATABASE_URL = "postgresql://postgres:lozinka@localhost:5432/moja_baza"

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    return Session(engine)

def get_db():
    with Session(engine) as session:
        yield session