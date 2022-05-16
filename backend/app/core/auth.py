import jwt
from fastapi import Depends, HTTPException, status
from jwt import PyJWTError
from pydantic.networks import EmailStr

import app.db.schemas.user as schemas
from app.db.models import User
import app.db.session as session

from app.db.crud.user import get_user_by_email, create_user
from app.core import security
from fastapi.logger import logger
from typing import Optional, Tuple

from fastapi.security.utils import get_authorization_scheme_param
from starlette.authentication import AuthenticationBackend, AuthenticationError
from starlette.requests import HTTPConnection


async def get_current_user(
    db=Depends(session.get_db), token: str = Depends(security.oauth2_scheme)
):
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
        token_data = schemas.TokenData(email=email, permissions=permissions)
    except PyJWTError:
        print('error jwt')
        raise credentials_exception
    user = get_user_by_email(db, token_data.email)
    if user is None:
        print('error user')
        raise credentials_exception
    return user


async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def authenticate_user(db, email: str, password: str):
    user = get_user_by_email(db, email)
    logger.info(f"Authenticate user {email} with password {password}")
    if not user:
        return False
    if not security.verify_password(password, user.hashed_password):
        return False
    return user

