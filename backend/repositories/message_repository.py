from sqlmodel import Session, select
from models.message import Message
from datetime import datetime
from schemas.message_schemas import MessageCreate
from sqlalchemy import or_, and_
from models.postavi_oglas_b import Oglas
from models.user import User




def create_message(db: Session, data: MessageCreate, sender_id: int):
    message = Message(
        sender_id=sender_id,
        receiver_id=data.receiver_id,
        oglas_id=data.oglas_id,
        content=data.content,
        timestamp=datetime.utcnow()
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_messages_by_oglas(db: Session, oglas_id: int):
    return db.exec(select(Message).where(Message.oglas_id == oglas_id)).all()



# def get_chat_for_oglas(db: Session, oglas_id: int, user_id: int):
#     sve_poruke = db.query(Message).filter(Message.oglas_id == oglas_id).all()

#     # Nađi ID drugog učesnika u chatu
#     drugi_id = None
#     for p in sve_poruke:
#         if p.sender_id != user_id:
#             drugi_id = p.sender_id
#             break
#         if p.receiver_id != user_id:
#             drugi_id = p.receiver_id
#             break

#     if drugi_id is None:
#         return []

#     return db.query(Message).filter(
#         Message.oglas_id == oglas_id,
#         or_(
#             and_(Message.sender_id == user_id, Message.receiver_id == drugi_id),
#             and_(Message.sender_id == drugi_id, Message.receiver_id == user_id)
#         )
#     ).order_by(Message.timestamp).all()

from models.user import User
from schemas.message_schemas import MessageRead

def get_chat_for_oglas(db: Session, oglas_id: int, user_id: int):
    sve_poruke = db.query(Message).filter(Message.oglas_id == oglas_id).all()

    # Nađi drugog učesnika
    drugi_id = None
    for p in sve_poruke:
        if p.sender_id != user_id:
            drugi_id = p.sender_id
            break
        if p.receiver_id != user_id:
            drugi_id = p.receiver_id
            break

    if drugi_id is None:
        return []

    poruke = db.query(Message).filter(
        Message.oglas_id == oglas_id,
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == drugi_id),
            and_(Message.sender_id == drugi_id, Message.receiver_id == user_id)
        )
    ).order_by(Message.timestamp).all()

    rezultat = []
    for p in poruke:
        korisnik = db.query(User).filter(User.id == p.sender_id).first()
        rezultat.append(MessageRead(
            id=p.id,
            sender_id=p.sender_id,
            receiver_id=p.receiver_id,
            oglas_id=p.oglas_id,
            content=p.content,
            timestamp=p.timestamp,
            sender_username=korisnik.username if korisnik else str(p.sender_id)
        ))

    return rezultat





def count_unread_messages(db: Session, user_id: int) -> int:
    return db.query(Message).filter(
        Message.receiver_id == user_id,
        Message.procitana == False
    ).count()

def mark_as_read(db: Session, oglas_id: int, user_id: int):
    db.query(Message).filter(
        Message.oglas_id == oglas_id,
        Message.receiver_id == user_id,
        Message.procitana == False
    ).update({Message.procitana: True})
    db.commit()
