from sqlmodel import Session, select
from database import engine
from models.admin import Admin
from services.auth import hash_password

with Session(engine) as session:
    admin = session.exec(select(Admin).where(Admin.username == "admin")).first()

    if admin:
        print("🧹 Brišem starog admina...")
        session.delete(admin)
        session.commit()

    print("✅ Dodajem novog admina...")
    admin = Admin(
        username="admin",
        email="admin@example.com",
        hashed_password=hash_password("admin23")
    )
    session.add(admin)
    session.commit()
    print("🎉 Admin podešen!")
