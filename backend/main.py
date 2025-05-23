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

