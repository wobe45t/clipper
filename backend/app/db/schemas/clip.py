from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClipBase(BaseModel):
    text: str
    seconds: int
    note: Optional[str]
    date: Optional[datetime]

class ClipCreate(ClipBase):
    file_id: int 

class ClipUpdate(BaseModel):
    text: Optional[str]
    note: Optional[str]

    class Config:
        orm_mode = True

class Clip(ClipBase):
    id: int
    file_id: int

    class Config:
        orm_mode = True

class ClipResponse(ClipBase):
    id: int
    file_id: int

    class Config:
        orm_mode = True