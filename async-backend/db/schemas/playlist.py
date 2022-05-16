from pydantic import BaseModel, Field
from typing import List, Optional
from .file import FileResponse
from .tag import TagResponse

class PlaylistBase(BaseModel):
    name: str

class PlaylistCreate(PlaylistBase):
    user_id: int 


class PlaylistEdit(PlaylistBase):
    class Config:
        orm_mode = True

class Playlist(PlaylistBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# Responses for Home Screen
class PlaylistResponse(BaseModel):
    id: Optional[int]
    name: Optional[str]
    files: Optional[List[FileResponse]]
    tags: Optional[List[TagResponse]]

    class Config:
        orm_mode = True