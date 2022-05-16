from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models import File
from ..schemas import file as schemas
from typing import List, Optional


def get_file(db: Session, file_id: int) -> Optional[schemas.File]:
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file 


def get_playlist_files(db: Session, playlist_id: int) -> List[schemas.File]:
    return db.query(File).filter(File.playlist_id == playlist_id).all()

def create_file(db: Session, file: schemas.FileCreate):
    db_file = File(
        name=file.name,
        playlist_id=file.playlist_id,
        duration=file.duration,
        bit_rate=file.bit_rate,
        user_id=file.user_id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def delete_file(db: Session, file_id: int):
    file = get_file(db, file_id)
    if not file:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="File not found")
    db.delete(file)
    db.commit()
    return file 


def edit_file(
    db: Session, file_id: int, file: schemas.FileEdit
) -> schemas.File:
    db_file = get_file(db, file_id)
    if not db_file:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="File not found")
    update_data = file.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_file, key, value)

    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def update_file(db: Session, file_id: int, name: str) -> schemas.File:
    try:
        updated_file = db.query(File).filter(File.id == file_id).update(values={'name': name})
        db.commit()
        return updated_file
    except Exception:
        raise Exception('Could not update file')