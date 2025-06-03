import os
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from decimal import Decimal
from database import get_session
from models.postavi_oglas_b import Oglas
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
router = APIRouter()

class OglasCreate(BaseModel):
    naslov: str
    opis: str
    slike: List[str]
    cijena: Decimal
    lokacija: str
    kontakt: str
    kategorija: str

@router.post("/oglasi/")
def create_oglas(oglas: OglasCreate, session: Session = Depends(get_session)):
    novi_oglas = Oglas(
        naslov=oglas.naslov,
        opis=oglas.opis,
        slike=oglas.slike,
        cijena=oglas.cijena,
        lokacija=oglas.lokacija,
        kontakt=oglas.kontakt,
        kategorija=oglas.kategorija,
    )
    session.add(novi_oglas)
    session.commit()
    session.refresh(novi_oglas)
    return {"id": novi_oglas.id, "message": "Oglas uspješno postavljen"}

@router.get("/oglasi/", response_model=List[Oglas])
def read_oglasi(session: Session = Depends(get_session)):
    oglasi = session.exec(select(Oglas)).all()
    return oglasi



UPLOAD_DIR = "uploads"

# Napravi folder ako ne postoji
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload_slika/")
async def upload_slike(files: List[UploadFile] = File(...)):
    saved_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        try:
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            saved_files.append(f"/{UPLOAD_DIR}/{file.filename}")  # putanja za frontend (možeš prilagoditi)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Greška pri čuvanju slike: {str(e)}")
    return JSONResponse(content={"uploaded": saved_files})
