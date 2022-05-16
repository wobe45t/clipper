from app.db.session import get_db, init_database
from app.db.crud.user import create_user
from app.db.session import SessionLocal
from pydantic import EmailStr
import argparse
import os

def init(email: EmailStr, password: str) -> None:
    db = SessionLocal()
    create_user(
        db,
        email,
        password,
        True,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Database initialization script")    
    parser.add_argument('-f', '--force', action='store_true', default=False, help="Force replace database")
    args = parser.parse_args()
    if(args.force):
        try:
            os.remove('./test.db')
        except Exception as e:
            print("Error removing database : ", e)
    # email =  input('Email : ')
    # password =  input('Password : ')
    email = 'root@root.com'
    password = 'root'
    print(f"Creating superuser {email} {password}")
    init_database()
    init(email, password)
