from fastapi import HTTPException, status
from sqlalchemy import text, update
from sqlalchemy.orm import Session
from ..models import Playlist, File, User, Tag
from ..crud import tag as crud_tag

from ..schemas import file as schemas_file
from ..schemas import playlist as schemas_playlist
from typing import List


def get_playlist(db: Session, playlist_id: int):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist 

def get_playlists(db: Session, user_id: int) -> schemas_playlist.PlaylistResponse:
    playlists = db.query(Playlist).filter(Playlist.user_id == user_id).all()
    return playlists
    
def get_playlist_files(db: Session, playlist_id: int) -> List[schemas_file.File]:
    return db.query(File).filter(File.playlist_id == playlist_id).all()

def edit_playlist(db: Session, playlist_id: int, playlist: schemas_playlist.PlaylistEdit):
    updated_playlist = db.query(Playlist).filter(Playlist.id == playlist_id).update(values={'name': playlist.name})
    db.commit()
    return True

def delete_playlist(db: Session, playlist_id: int):
    playlist = get_playlist(db, playlist_id) # ! could be optimized - now queries but doesnt have to 
    if not playlist:
        return False
    try:
        db.delete(playlist) # * propagating deletion to it's children - files
        db.commit()
    except Exception:
        raise Exception("Failed to delete playlist")
        
    return True

def create_playlist(db: Session, playlist: schemas_playlist.PlaylistCreate):
    db_playlist = Playlist(
        name=playlist.name,
        user_id=playlist.user_id
    )
    db.add(db_playlist)
    db.commit()
    db.refresh(db_playlist)
    return db_playlist


def add_tag(db: Session, playlist_id: int, tag_id: int):
    playlist_db = get_playlist(db, playlist_id)
    tag_db = crud_tag.get_tag(db, tag_id)
    playlist_db.tags.append(tag_db)

    db.commit()

    return "OK"

def delete_tag(db: Session, playlist_id: int, tag_id: int):
    playlist_db = get_playlist(db, playlist_id)
    tag_db = crud_tag.get_tag(db, tag_id)
    playlist_db.tags.remove(tag_db)

    db.commit()

    return "OK"


def update_tags(db: Session, playlist_id: int, tags: List[int]):
    playlist_db = db.query(Playlist).filter(Playlist.id == playlist_id).one()
    tags_db = db.query(Tag).filter(Tag.id.in_(tags)).all()
    print(tags_db)
    playlist_db.tags = tags_db
    db.commit()
    
    return "OK"