from fastapi import (
    APIRouter,
    Depends,
    Path,
    UploadFile,
    File as FileObject,
    status,
    HTTPException,
    Body,
    Request
)
from fastapi.responses import RedirectResponse
from typing import List
from math import ceil

from pydub.utils import mediainfo

from tempfile import NamedTemporaryFile

from db.dals.tag_dal import TagDAL
from dependencies import get_tag_dal

from db.models.playlist import Playlist
from db.schemas.tag import TagCreate, TagData


router = r = APIRouter()


@r.post('/tags/{user_id}')
async def add_tag(user_id: int, tag: TagData, tag_dal: TagDAL = Depends(get_tag_dal)):
    new_tag = await tag_dal.add_tag(
        TagCreate(user_id=user_id, name=tag.name, color=tag.color))
    if new_tag:
        return new_tag
    else:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR)

@r.delete('/tags/{tag_id}')
async def delete_tag(tag_id: int, tag_dal: TagDAL = Depends(get_tag_dal)):
    result = await tag_dal.delete_tag(tag_id)
    if not result:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return result