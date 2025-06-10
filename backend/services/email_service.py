import smtplib
from email.message import EmailMessage

def send_confirmation_email(to_email: str, username: str):
    msg = EmailMessage()
    msg["Subject"] = "Oglas je uspešno poslat"
    msg["From"] = "hasnijaselmanovic123@gmail.com"  
    msg["To"] = to_email

    msg.set_content(f"""
Zdravo, {username}!

Uspešno ste kreirali oglas. 

Hvala što koristite KlikOglas!
""")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login("hasnijaselmanovic123@gmail.com", "iper yhjn jiwb yyuc")
            smtp.send_message(msg)
    except Exception as e:
        print("Greška prilikom slanja emaila:", e)


