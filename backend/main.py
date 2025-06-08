from fastapi import FastAPI, Depends
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from database import get_session
from controllers import user
from sqlmodel import SQLModel
from database import engine
from fastapi.middleware.cors import CORSMiddleware
#from controllers.postavi_oglas import router as oglasi_router
from controllers import postavi_oglas,oglas_controller,oglasi_detaljno
from fastapi.staticfiles import StaticFiles
from controllers import admin
from models import admin_init

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    #allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
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

#app.include_router(oglasi_router)
app.include_router(postavi_oglas.router)
app.include_router(oglas_controller.router, tags=["Oglasi"])

app.include_router(oglasi_detaljno.router)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")



app.include_router(admin.router, prefix="/auth")



@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    import models.admin_init  # ✅ samo ovo je dovoljno jer kod unutar fajla automatski izvršava dodavanje admina
