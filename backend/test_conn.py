from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:lozinka@localhost:5432/moja_baza"

engine = create_engine(DATABASE_URL, echo=True)

try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("✅ Uspešno povezivanje sa bazom.")
except Exception as e:
    print("⛔ Greška pri konekciji:", e)
