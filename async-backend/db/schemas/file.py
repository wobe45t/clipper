from pydantic import BaseModel

class FileBase(BaseModel):
    name: str
    duration: int
    bit_rate : int

class FileCreate(FileBase):
    playlist_id: int 
    user_id: int


class FileEdit(FileBase):
    class Config:
        orm_mode = True

class File(FileBase):
    id: int
    playlist_id: int
    user_id: int
    duration: int
    bit_rate : int

    class Config:
        orm_mode = True

# Response for Home Screen
class FileResponse(BaseModel):
    id: int
    name: str 
    duration: int

    class Config:
        orm_mode = True