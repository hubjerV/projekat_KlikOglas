from datetime import datetime, timedelta
from sqlmodel import Session, select
from models.postavi_oglas_b import Oglas

def arhiviraj_stare_oglase(session: Session):
    mjesec_dana_prije = datetime.utcnow() - timedelta(days=30)
    oglasi_za_arhivirati = session.exec(
        select(Oglas).where(
            Oglas.datum_postavljanja < mjesec_dana_prije,
            Oglas.arhiviran == False
        )
    ).all()

    for oglas in oglasi_za_arhivirati:
        oglas.arhiviran = True
        session.add(oglas)

    if oglasi_za_arhivirati:
        session.commit()
