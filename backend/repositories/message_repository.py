from sqlmodel import Session, select
from models.message import Message
from datetime import datetime
from schemas.message_schemas import MessageCreate


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



def get_chat_for_oglas(db: Session, oglas_id: int, user_id: int):
    return db.exec(
        select(Message)
        .where(Message.oglas_id == oglas_id)
        .where(
            (Message.sender_id == user_id) | (Message.receiver_id == user_id)
        )
        .order_by(Message.timestamp)
    ).all()

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
