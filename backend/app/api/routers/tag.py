from fastapi import APIRouter, Depends, HTTPException, Path, status, Body
from app.db.session import get_db
from app.db.crud import tag as crud_tag
from app.db.schemas import tag as schema_tag
from typing import List
from app.core.auth import get_current_user

tag_router = r = APIRouter()

@r.get("/tags/{user_id}")
async def get_tags(user_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    tags = crud_tag.get_tags(db, user_id)
    return tags 


@r.post('/tags/{user_id}')
async def add_tag(user_id: int, tag: schema_tag.TagBase, db=Depends(get_db), user=Depends(get_current_user)):
    try:
        tag_db = crud_tag.create_tag(db, schema_tag.TagCreate(
            name=tag.name,
            color=tag.color,
            user_id=user_id,
        ))
        db.flush()
        return tag_db
    except Exception as e:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=str(e))

@r.delete('/tags/{tag_id}')
async def delete_tag(tag_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    result = crud_tag.delete_tag(db, tag_id)
    if not result:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tag not found")
    else:
        return "deleted"
