from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from ..models import Tag 
from ..schemas import tag as schemas_tag
from typing import List


def get_tag(db: Session, tag_id: int):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag 

def get_tags(db: Session, user_id: int) -> schemas_tag.TagResponse:
    tags = db.query(Tag).filter(Tag.user_id == user_id).all()
    return tags
    
def delete_tag(db: Session, tag_id: int):
    tag = get_tag(db, tag_id) # ! could be optimized - now queries but doesnt have to 
    if not tag:
        return False
    db.delete(tag) # * propagating deletion to it's children - files
    db.expire_all() # TODO check the behaviour without this line
    db.commit()
    return True

def create_tag(db: Session, tag: schemas_tag.TagCreate):
    try:
        db_tag = Tag(
            name=tag.name,
            color=tag.color,
            user_id=tag.user_id
        )
        db.add(db_tag)
        db.commit()
        db.refresh(db_tag)
        return db_tag
    except Exception as e:
        raise Exception(f"Tag with name {tag.name} already exists") 
