from fastapi import FastAPI, Depends
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from database import get_session
from sqlmodel import SQLModel
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from controllers import user_public



from controllers import user
from controllers import postavi_oglas, oglas_controller, oglasi_detaljno, message_controller
from controllers import admin
from models import admin_init


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    from models.admin import Admin
    import models.admin_init
    SQLModel.metadata.create_all(engine)

@app.get("/")
def read_root():
    return {"message": "Zdravo iz FastAPI!"}

@app.get("/test-db")
def test_db(session = Depends(get_session)):
    try:
        session.execute(text("SELECT 1"))
        return {"status": "OK", "message": "Baza uspešno povezana"}
    except OperationalError as e:
        return {"status": "ERROR", "message": str(e)}


app.include_router(user.router, prefix="/auth", tags=["Auth"])
app.include_router(postavi_oglas.router)
app.include_router(oglas_controller.router, tags=["Oglasi"])
app.include_router(oglasi_detaljno.router)
app.include_router(message_controller.router, tags=["Poruke"])

app.include_router(user_public.router, prefix="/public", tags=["User Public"])

app.include_router(admin.router, prefix="/auth")


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

