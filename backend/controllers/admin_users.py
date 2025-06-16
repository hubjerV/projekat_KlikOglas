
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.postavi_oglas_b import Oglas  
from database import get_session
from services.auth import get_current_user
from models.user import User
from schemas.user_schema import UserUpdate
from models.message import Message  
from models.admin import Admin
from models.kategorije import Kategorija

admin_router = APIRouter(prefix="/admin/users", tags=["Admin - Users"])

@admin_router.get("/emails")
def get_admin_emails(session: Session = Depends(get_session)):  # ispravljen Depends
    admins = session.exec(select(Admin)).all()
    return [admin.email for admin in admins]

#da dodam novu kateg
@admin_router.post("/kategorije")
def dodaj_kategoriju(data: dict, session: Session = Depends(get_session)):
    nova = Kategorija(naziv=data["naziv"])
    session.add(nova)
    session.commit()
    session.refresh(nova)
    return nova

#dobavim sve kategorije
@admin_router.get("/kategorije")
def sve_kategorije(session: Session = Depends(get_session)):
    return session.exec(select(Kategorija)).all()


#brisem sve kategorije
# @admin_router.delete("/kategorije/{id}")
# def obrisi_kategoriju(id: int, session: Session = Depends(get_session)):
#     kat = session.get(Kategorija, id)
#     if not kat:
#         raise HTTPException(404, "Kategorija ne postoji")
#     session.delete(kat)
#     session.commit()
#     return {"msg": "Obrisana"}

@admin_router.delete("/kategorije/{naziv}")
def obrisi_kategoriju_po_nazivu(naziv: str, session: Session = Depends(get_session)):
    kat = session.exec(select(Kategorija).where(Kategorija.naziv == naziv)).first()
    if not kat:
        raise HTTPException(404, "Ne postoji kategorija")
    session.delete(kat)
    session.commit()
    return {"msg": "Obrisana"}





@admin_router.get("/{user_id}/oglasi")
def get_user_oglasi(user_id: int, session: Session = Depends(get_session),  admin = Depends(get_current_user)):
    oglasi = session.exec(select(Oglas).where(Oglas.id_korisnika == user_id)).all()
    return oglasi

#da prikazžem sve korisnike
# @admin_router.get("/")
# def get_all_users(session: Session = Depends(get_session), admin=Depends(get_current_user)):
#     return session.exec(select(User)).all()

@admin_router.get("/")
def get_all_users(
    username: str = None,
    session: Session = Depends(get_session),
    admin = Depends(get_current_user)
):
    query = select(User)
    
    if username:
        query = query.where(User.username.contains(username))  # ili `==` ako želiš tačno poklapanje

    return session.exec(query).all()


@admin_router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session), admin = Depends(get_current_user)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")
    return user



#da mogu urediti profile korisnika
@admin_router.put("/{user_id}")
def update_user(
    user_id: int,
    user_data: UserUpdate,
    session: Session = Depends(get_session),
    admin = Depends(get_current_user)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


#da izbrisem sve korsnike

@admin_router.delete("/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session), admin = Depends(get_current_user)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    session.delete(user)
    session.commit()
    return {"msg": "Korisnik obrisan"}

# @admin_router.delete("/oglasi/{oglas_id}")
# def delete_oglas(oglas_id: int, session: Session = Depends(get_session), admin = Depends(get_current_user)):
#     oglas = session.get(Oglas, oglas_id)
#     if not oglas:
#         raise HTTPException(status_code=404, detail="Oglas nije pronađen")

#     session.delete(oglas)
#     session.commit()
#     return {"msg": "Oglas obrisan"}



@admin_router.delete("/oglasi/{oglas_id}")
def delete_oglas(oglas_id: int, session: Session = Depends(get_session), admin = Depends(get_current_user)):
    oglas = session.get(Oglas, oglas_id)
    if not oglas:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")

    # 🔥 Obriši poruke koje referenciraju ovaj oglas
    session.exec(select(Message).where(Message.oglas_id == oglas_id)).all()
    for msg in session.exec(select(Message).where(Message.oglas_id == oglas_id)):
        session.delete(msg)

    session.delete(oglas)
    session.commit()
    return {"msg": "Oglas obrisan"}


# @admin_router.get("/emails")
# def get_admin_emails(session: Session = Depends(get_session), admin = Depends(get_current_user)):
#     emails = session.exec(select(Admin.email)).all()
#     return emails  # Ovo će vratiti listu emailova kao niz





