from fastapi import APIRouter, Depends, HTTPException, status, Form
from pydantic import EmailStr
from app.db.session import get_db
import app.db.schemas.user as schemas
from app.core.auth import authenticate_user
from datetime import timedelta
import app.core.security as security
from app.db.crud.user import create_user, get_user_by_email

auth_router = r = APIRouter()


@r.post("/login", response_model=schemas.UserLogin)
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db=Depends(get_db),
):
    """
    Login existing user
    """
    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = "admin"
    else:
        permissions = "user"
    access_token = security.create_access_token(
        data={"email": user.email, "permissions": permissions},
        expires_delta=access_token_expires,
    )

    user_data = schemas.User.from_orm(user)
    return schemas.UserLogin(**user_data.dict(), access_token=access_token)


@r.post("/signup", response_model=schemas.User, response_model_exclude_none=True)
async def signup(email: EmailStr = Form(...), password: str = Form(...), db=Depends(get_db)):
    """
    Create a new user
    """
    user = get_user_by_email(db, email)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    return create_user(db, email, password)  
