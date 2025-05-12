'''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Dodavanje CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Omogućava sve domene da prave zahteve (možeš ograničiti na konkretne domene ako želiš)
    allow_credentials=True,
    allow_methods=["*"],  # Omogućava sve HTTP metode (GET, POST, itd.)
    allow_headers=["*"],  # Omogućava sve zaglavlja
)

@app.get("/")
async def root():
    return {"message": "Pozdrav sa FastAPI backend-a!"}

'''

from fastapi import FastAPI, Depends
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from database import get_session

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Zdravo iz FastAPI!"}


@app.get("/test-db")
def test_db(session = Depends(get_session)):
    try:
        session.execute(text("SELECT 1"))   # ⬅️ Ispravljeno
        return {"status": "OK", "message": "Baza uspešno povezana"}
    except OperationalError as e:
        return {"status": "ERROR", "message": str(e)}

