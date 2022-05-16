from pydantic import BaseModel
from typing import List, Optional

class TagBase(BaseModel):
    name: str
    color: str

class TagCreate(TagBase):
    user_id: int  

class Tag(TagBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class TagResponse(BaseModel):
    id: int
    name: str
    color: str

    class Config:
        orm_mode = True