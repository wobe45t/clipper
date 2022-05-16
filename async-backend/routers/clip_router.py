from fastapi import (
    APIRouter,
    Depends,
    Path,
    UploadFile,
    File as FileObject,
    status,
    HTTPException,
    Body,
    Request,
    Query
)
from fastapi.responses import RedirectResponse
from typing import List
from math import ceil

from pydub.utils import mediainfo

from tempfile import NamedTemporaryFile

from db.dals.playlist_dal import PlaylistDAL
from db.dals.file_dal import FileDAL
from db.dals.user_dal import UserDAL

from db.models.playlist import Playlist
from db.models.file import File

from db.schemas.playlist import PlaylistResponse

from dependencies import get_playlist_dal, get_file_dal, get_user_dal 

from db.config import s3
import io
from pydub import AudioSegment

router = r = APIRouter()

CLIP_DURATION = 10

@r.get('/clip/{file_id}')
async def generate_clip(file_id: int = Path(...), seconds: int = Query(...), file_dal: FileDAL = Depends(get_file_dal)):
    file_db = await file_dal.get_file(file_id)
    print(file_db)

    from_bytes = int((seconds * file_db.bit_rate) / 8)
    to_bytes = int(from_bytes - (CLIP_DURATION * file_db.bit_rate) / 8 )

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
    # transcription = transcribe_file(file_like_output)

    await file_dal.create_clip(
        seconds=seconds,
        text='test',
        file_id=file_id
    )
    return "OK"