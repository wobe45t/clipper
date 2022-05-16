from typing import List, Optional

from sqlalchemy import update
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from db.models.user import User
from db.core.security import get_password_hash, verify_password

import jwt
from fastapi import Depends, HTTPException, status
from jwt import PyJWTError
from db.core import security

class UserDAL():
    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def create_user(self, email: str, password: str):
        hashed_password = await get_password_hash(password)
        new_user = User(email=email, hashed_password=hashed_password)
        self.db_session.add(new_user)
        await self.db_session.flush()
        return new_user

    async def get_users(self) -> List[User]:
        q = await self.db_session.execute(select(User).order_by(User.id))
        return q.scalars().all()


    async def get_user_by_email(self, email: str) -> User:
        q = await self.db_session.execute(select(User).where(User.email == email))
        return q.scalars().first()

    async def authenticate_user(self, email: str, password: str):
        user = await self.get_user_by_email(email)
        if not user:
            return False

        if not await verify_password(password, user.hashed_password):
            return False
        return user

    async def get_current_user(self, token):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(
                token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
            )
            print(payload)
            email: str = payload.get("email")
            if email is None:
                print('error email')
                raise credentials_exception
        except PyJWTError:
            print('error jwt')
            raise credentials_exception
        user = await self.get_user_by_email(email)
        if user is None:
            print('error user')
            raise credentials_exception
        return user