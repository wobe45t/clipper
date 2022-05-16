import jwt
from fastapi import Depends, HTTPException, status
from jwt import PyJWTError
from pydantic.networks import EmailStr

from fastapi.logger import logger
from typing import Optional, Tuple

from fastapi.security.utils import get_authorization_scheme_param
from starlette.authentication import AuthenticationBackend, AuthenticationError
from starlette.requests import HTTPConnection
import .security as security

class Auth():
    def __init__(self, db_session):
        self.db_session = db_session

    async def get_current_user(db=Depends(session.get_db), token: str = Depends(security.oauth2_scheme)):
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
            permissions: str = payload.get("permissions")
        except PyJWTError:
            print('error jwt')
            raise credentials_exception
        user = get_user_by_email(db, email)
        if user is None:
            print('error user')
            raise credentials_exception
        return user

