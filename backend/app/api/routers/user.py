from fastapi import APIRouter, Depends, HTTPException, Path, status, Body
import app.db.schemas.user as schemas
from app.db.session import get_db
import app.db.crud.user as user_crud

user_router = r = APIRouter()

@r.get('/user')
def main():
    return "Test"