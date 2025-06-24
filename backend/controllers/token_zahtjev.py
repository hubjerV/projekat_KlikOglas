# controllers/token_zahtjev.py

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List

from database import get_session
from models.token_zahtjev import TokenZahtjev
from models.user import User
from auth.oauth2 import get_current_user, get_current_admin
from schemas.token_zahtjev import TokenZahtjevCreate, TokenZahtjevRead

router = APIRouter(prefix="/token-zahtjevi", tags=["TokenZahtjevi"])

# 🧾 Korisnik šalje zahtjev za dopunu tokena
@router.post("/", response_model=TokenZahtjevRead)
def posalji_zahtjev(
    zahtjev: TokenZahtjevCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    aktivan = session.query(TokenZahtjev).filter(
        TokenZahtjev.korisnik_id == current_user.id,
        TokenZahtjev.status == "na čekanju"
    ).first()

    if aktivan:
        raise HTTPException(status_code=400, detail="Već imate zahtjev na čekanju.")

    novi_zahtjev = TokenZahtjev(
        korisnik_id=current_user.id,
        broj_tokena=zahtjev.broj_tokena
    )

    session.add(novi_zahtjev)
    session.commit()
    session.refresh(novi_zahtjev)

    return novi_zahtjev


# ✅ Admin: pregled svih zahtjeva
@router.get("/", response_model=List[TokenZahtjevRead])
def pregled_zahtjeva(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    return session.query(TokenZahtjev).all()


# ✅ Admin: odobravanje zahtjeva
@router.post("/{zahtjev_id}/odobri")
def odobri_zahtjev(
    zahtjev_id: int = Path(...),
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    zahtjev = session.get(TokenZahtjev, zahtjev_id)
    if not zahtjev:
        raise HTTPException(status_code=404, detail="Zahtjev ne postoji")

    if zahtjev.status != "na čekanju":
        raise HTTPException(status_code=400, detail="Zahtjev je već obrađen")

    korisnik = session.get(User, zahtjev.korisnik_id)
    korisnik.findit_tokeni += zahtjev.broj_tokena
    zahtjev.status = "odobreno"

    session.add_all([korisnik, zahtjev])
    session.commit()
    return {"message": "Zahtjev odobren i tokeni dodani korisniku."}


# ❌ Admin: odbijanje zahtjeva
@router.post("/{zahtjev_id}/odbij")
def odbij_zahtjev(
    zahtjev_id: int = Path(...),
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    zahtjev = session.get(TokenZahtjev, zahtjev_id)
    if not zahtjev:
        raise HTTPException(status_code=404, detail="Zahtjev ne postoji")

    if zahtjev.status != "na čekanju":
        raise HTTPException(status_code=400, detail="Zahtjev je već obrađen")

    zahtjev.status = "odbijeno"
    session.add(zahtjev)
    session.commit()
    return {"message": "Zahtjev odbijen."}
