from fastapi import (
    APIRouter,
    Depends,
    Path,
    Query,
    status,
    Body,
    HTTPException,
)
from fastapi.responses import StreamingResponse

from pydub import AudioSegment
import io
from app.core.transcription import transcribe_file

from typing import List

import app.db.schemas.file as schemas_file
import app.db.schemas.clip as schemas_clip
import app.db.schemas.response as schemas_response
from app.db.crud import file as crud_file
from app.db.crud import clip as crud_clip
from app.core.auth import get_current_user

from app.db.session import get_db, s3 

clip_router = r = APIRouter()


CLIP_DURATION = 10

@r.get('/clip/{file_id}')
async def generate_clip(file_id: int = Path(...), seconds: int = Query(...), db=Depends(get_db), user=Depends(get_current_user)):
    file_db = crud_file.get_file(db, file_id)

    from_bytes = int((seconds * file_db.bit_rate) / 8)
    to_bytes = int(from_bytes - (CLIP_DURATION * file_db.bit_rate) / 8 )
    assert from_bytes > 0
    assert to_bytes > 0
    file_object = s3.get_object(Bucket='clipper-app', Key=f'{file_db.user_id}/{file_db.id}', Range=f'bytes={to_bytes}-{from_bytes}')

    file_bytes = file_object['Body'].read()
    with open(f'{to_bytes}', 'wb') as f:
        f.write(file_bytes)

    # Define file-like objects
    file_like_input = io.BytesIO(file_bytes)
    file_like_output = io.BytesIO()

    audio = AudioSegment.from_file(file_like_input)

    audio.export(file_like_output, format="flac", parameters=['-ac', '1'])

    # # send the clip to google cloud
    transcription = transcribe_file(file_like_output)

    crud_clip.create_clip(db, schemas_clip.ClipCreate(
        seconds=seconds,
        text=transcription,
        file_id=file_id
    ))
    return "OK"

@r.get('/clips/{playlist_id}', response_model=List[schemas_clip.ClipResponse])
async def get_playlist_clips(playlist_id : int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    clips_db = crud_clip.get_playlist_clips(db, playlist_id)
    return clips_db

@r.get('/clips/{playlist_id}/export')
async def export_playlist_clips(playlist_id: int = Path(...), db=Depends(get_db)):
    clips_db = crud_clip.get_playlist_clips(db, playlist_id)
    file_like = io.StringIO()
    for clip in clips_db:
        file_like.write(f'{clip.date}\n{clip.text}\n')
        if clip.note:
            file_like.write(f'{clip.note}\n')
        file_like.write('\n')

    return StreamingResponse(iter([file_like.getvalue()]), media_type="bytes/octet-stream")

@r.post('/clips/{file_id}')
async def add_clip(file_id: int = Path(...), text: str = Body(...), note: str = Body(None), db=Depends(get_db)):
    crud_clip.create_clip(db, schemas_clip.ClipCreate(text=text, seconds=5, file_id=file_id))
    return True

@r.delete('/clips/{clip_id}')
async def delete_clip(clip_id: int, db=Depends(get_db)):
    try: 
        result = crud_clip.delete_clip(db, clip_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))
    return result


@r.put('/clips/{clip_id}')
async def update_clip(clip_id: int, clip: schemas_clip.ClipUpdate, db=Depends(get_db)):
    try:
        result = crud_clip.update_clip(db, clip_id, clip)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))
    return result