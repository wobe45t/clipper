from pydantic import BaseModel, EmailStr
from fastapi import Form
from typing import Optional
from enum import Enum

class UserBase(BaseModel):
    email: EmailStr 
    is_superuser: Optional[bool] = False

class UserCreate(UserBase):
    # add validation for password
    # same validations will be for UserCredential so maybe abstract another class
    password: str 


class UserEdit(UserBase):
    email: Optional[EmailStr]
    password: Optional[str] = None

    class Config:
        orm_mode = True

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserLogin(User):
    access_token: str

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr
    permissions: str 