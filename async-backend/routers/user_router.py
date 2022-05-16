from typing import List, Optional

from fastapi import APIRouter, Depends, status, HTTPException, Form

from db.dals.user_dal import UserDAL
from db.models.user import User

from dependencies import get_user_dal

from db.core import security
from datetime import timedelta

router = r = APIRouter()

@r.post("/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
    user_dal: UserDAL = Depends(get_user_dal)
):
    """
    Login existing user
    """
    user = await user_dal.authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = await security.create_access_token(
        data={"email": user.email},
        expires_delta=access_token_expires,
    )

    return {'email': user.email, 'id': user.id, 'access_token': access_token}

@r.post("/signup")
async def signup(email: str = Form(...), password: str = Form(...), user_dal: UserDAL = Depends(get_user_dal)):
    """
    Create a new user
    """
    user = await user_dal.get_user_by_email(email)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    return await user_dal.create_user(email, password)  

@r.get("/users")
async def get_users(user_dal: UserDAL = Depends(get_user_dal)) -> List[User]:
    return await user_dal.get_users()