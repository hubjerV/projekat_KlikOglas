import os
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from decimal import Decimal
from services.email_service import send_confirmation_email
from database import get_session
from models.postavi_oglas_b import Oglas
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from models.user import User 
from services.auth import get_current_user  
from fastapi import Form



router = APIRouter()

class OglasCreate(BaseModel):
    naslov: str
    opis: str
    slike: List[str]
    cijena: Decimal
    lokacija: str
    kontakt: str
    kategorija: str



UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/oglasi-novi/")
async def create_oglas_novi(
    naslov: str = Form(...),
    opis: str = Form(...),
    cijena: Decimal = Form(...),
    lokacija: str = Form(...),
    kontakt: str = Form(...),
    kategorija: str = Form(...),
    slike: List[UploadFile] = File(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    slike_putanje = []

    for file in slike:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        slike_putanje.append(f"/{UPLOAD_DIR}/{file.filename}")

    novi_oglas = Oglas(
        naslov=naslov,
        opis=opis,
        slike=slike_putanje,
        cijena=cijena,
        lokacija=lokacija,
        kontakt=kontakt,
        kategorija=kategorija,
        id_korisnika=user.id
    )

    session.add(novi_oglas)
    session.commit()
    session.refresh(novi_oglas)
    send_confirmation_email(to_email=user.email, username=user.username)


    return {"id": novi_oglas.id, "message": "Oglas sa slikama je uspešno postavljen"}



@router.get("/oglasi/", response_model=List[Oglas])
def read_oglasi(session: Session = Depends(get_session)):
    oglasi = session.exec(select(Oglas)).all()
    return oglasi



# @router.post("/upload_slika/")
# async def upload_slike(files: List[UploadFile] = File(...)):
#     saved_files = []
#     for file in files:
#         file_path = os.path.join(UPLOAD_DIR, file.filename)
#         try:
#             with open(file_path, "wb") as f:
#                 content = await file.read()
#                 f.write(content)
#             saved_files.append(f"/{UPLOAD_DIR}/{file.filename}")  # putanja za frontend (možeš prilagoditi)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Greška pri čuvanju slike: {str(e)}")
#     return JSONResponse(content={"uploaded": saved_files})
# @router.post("/oglasi/")
# def create_oglas(oglas: OglasCreate, session: Session = Depends(get_session)):
#     novi_oglas = Oglas(
#         naslov=oglas.naslov,
#         opis=oglas.opis,
#         slike=oglas.slike,
#         cijena=oglas.cijena,
#         lokacija=oglas.lokacija,
#         kontakt=oglas.kontakt,
#         kategorija=oglas.kategorija,
#     )
#     session.add(novi_oglas)
#     session.commit()
#     session.refresh(novi_oglas)
#     return {"id": novi_oglas.id, "message": "Oglas uspješno postavljen"}

# @router.post("/oglasi/")
# def create_oglas(
#     oglas: OglasCreate,
#     session: Session = Depends(get_session),
#     user: User = Depends(get_current_user)  # Dodaj ovo da zna ko je prijavljen
# ):
#     novi_oglas = Oglas(
#         naslov=oglas.naslov,
#         opis=oglas.opis,
#         slike=oglas.slike,
#         cijena=oglas.cijena,
#         lokacija=oglas.lokacija,
#         kontakt=oglas.kontakt,
#         kategorija=oglas.kategorija,
#         id_korisnika=user.id  # AUTOMATSKI postavi ID korisnika
#     )
#     session.add(novi_oglas)
#     session.commit()
#     session.refresh(novi_oglas)

#     return {"id": novi_oglas.id, "message": "Oglas uspješno postavljen"}