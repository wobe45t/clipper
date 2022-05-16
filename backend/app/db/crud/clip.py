from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models import Clip, File, Playlist
from ..schemas import clip as schemas
from typing import List, Optional
from datetime import datetime

def get_clip(db: Session, clip_id: int) -> Optional[schemas.Clip]:
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="File not found")
    return clip 


def get_playlist_clips(db: Session, playlist_id: int) -> List[schemas.Clip]:
    #TODO do anki return db.query(Clip, File, Playlist).filter(Clip.file_id == File.id).filter(File.playlist_id == Playlist.id).filter(Playlist.id == playlist_id).all()
    #TODO anki
    return db.query(Clip).join(File).join(Playlist).filter(Playlist.id == playlist_id).all()

def create_clip(db: Session, clip: schemas.ClipCreate):
    db_clip = Clip(
        text=clip.text,
        seconds=clip.seconds,
        date=datetime.now(),
        file_id=clip.file_id,
    )
    db.add(db_clip)
    db.commit()
    db.refresh(db_clip)
    return db_clip


def delete_clip(db: Session, clip_id: int):
    try:
        clip = get_clip(db, clip_id) 
        if not clip:
            return False

        db.delete(clip)
        db.expire_all()
        db.commit()
    except Exception:
        raise Exception('Couldnt delete the clip')

    return True

def update_clip(db: Session, clip_id: int, clip: schemas.ClipUpdate):
    try:
        updated_clip = db.query(Clip).filter(Clip.id == clip_id).update(values={**clip.dict(exclude_unset=True)})
        db.commit()
        return True
    except Exception:
        raise Exception("Couldn't update the clip")

