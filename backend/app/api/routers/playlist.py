from fastapi import (
    APIRouter,
    Depends,
    Path,
    UploadFile,
    File,
    status,
    HTTPException,
    Body,
    Request
)
from fastapi.responses import RedirectResponse, StreamingResponse
from typing import List
from math import ceil
import app.db.schemas.playlist as schemas_playlist
import app.db.schemas.file as schemas_file
import app.db.schemas.response as schemas_response
from app.db.crud import file as crud_file
from app.db.crud import playlist as crud_playlist
import requests

from app.db.session import get_db, s3
from pydub.utils import mediainfo
from app.core.auth import get_current_user

from tempfile import NamedTemporaryFile

playlist_router = r = APIRouter()


@r.delete('/playlist/{playlist_id}')
async def delete_playlist(playlist_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    playlist_db = crud_playlist.get_playlist(db, playlist_id)
    if playlist_db.user_id != user.id:
        raise HTTPException(status.HTTP_401_BAD_REQUEST,
                            detail='You are not authenticated to access that content')

    files = crud_playlist.get_playlist_files(db, playlist_id)
    for file in files:
        print(f'deleting file /{file.user_id}/{file.id}')
        try:
            s3.delete_object(Bucket='clipper-app',
                             Key=f'/{file.user_id}/{file.id}')
        except Exception:
            print("Couldn't delete file in s3 ERROR")
    # should propagate and delete children
    result = crud_playlist.delete_playlist(db, playlist_id)

    if not result:
        print("FINAL DELETE FAILED PLAYLIST ERROR")
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't delete playlist")
    return schemas_response.SuccessResponse(
        status=200,
        message="Successfully deleted playlist"
    )

# DEBUG


@r.get('/playlist/{playlist_id}/files')
async def get_playlist_files(playlist_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    playlists = crud_playlist.get_playlist_files(db, playlist_id)
    if not playlists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't find playlist")
    return playlists


def generate_urls(files) -> List[schemas_file.FileResponse]:
    result: List[schemas_file.FileResponse] = []
    for file in files:
        result.append(schemas_file.FileResponse(
            id=file.id,
            name=file.name,
            duration=file.duration,
            url=s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': 'clipper-app',
                    'Key': f'{file.user_id}/{file.id}',
                },
            )
        ))
    return result

@r.get('/playlist/{playlist_id}', response_model=schemas_playlist.PlaylistResponse)
async def get_playlist(playlist_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    playlist = crud_playlist.get_playlist(db, playlist_id)
    files = generate_urls(playlist.files)

    response = schemas_playlist.PlaylistResponse(
        id=playlist.id,
        name=playlist.name,
        tags=playlist.tags,
        files=files
    )

    if not response:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't find ")
    return response


@r.put('/playlist/{playlist_id}')
async def change_name(playlist_id: int = Path(...), name: str = Body(..., embed=True), db=Depends(get_db), user=Depends(get_current_user)):
    response = crud_playlist.edit_playlist(db, playlist_id, schemas_playlist.PlaylistEdit(
        name=name
    ))
    return response


@r.post('/playlists/{user_id}/upload')
async def upload_files(user_id: int = Path(...), name: str = Body(None), files: List[UploadFile] = File(...), db=Depends(get_db)):
    # TODO add some validation, error handling.
    playlist = crud_playlist.create_playlist(db, schemas_playlist.PlaylistCreate(
        user_id=user_id,
        name=name
    ))
    for file in files:
        with NamedTemporaryFile('r+b') as f:

            f.write(file.file.read())
            info = mediainfo(f.name)
            # print(info)
            duration = info['duration']
            bit_rate = info['bit_rate']
            # print(duration, bit_rate)

            file_db = crud_file.create_file(db, schemas_file.FileCreate(
                playlist_id=playlist.id,
                duration=ceil(float(duration)),
                bit_rate=bit_rate,
                user_id=user_id,
                name=file.filename
            ))

            s3.upload_file(f.name, "clipper-app",
                           f'{user_id}/{file_db.id}', ExtraArgs={'ContentType': 'audio/mpeg'})

    # TODO change the response
    return schemas_response.SuccessResponse(
        status=201,
        message='Successfully uploaded'
    )



@r.get('/playlists/{user_id}', response_model=List[schemas_playlist.PlaylistResponse])
async def get_playlists(user_id: int = Path(...), db=Depends(get_db), user=Depends(get_current_user)):
    try:
        result: List[schemas_playlist.PlaylistResponse] = []
        playlists = crud_playlist.get_playlists(db, user_id)
        for playlist in playlists:
            result.append(schemas_playlist.PlaylistResponse(
                id=playlist.id,
                name=playlist.name,
                tags=playlist.tags,
                files=generate_urls(playlist.files)
            ))
        
        return result 

    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail=str(e))


@r.get('/stream/{file_id}')
async def stream(req: Request, file_id: int = Path(...), db=Depends(get_db)):
    print(req.url.port)
    file = crud_file.get_file(db, file_id)
    if not file:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="File not found")

    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': 'clipper-app',
            'Key': f'{file.user_id}/{file.id}',
        },
    )
    return url.split('/', 3)[-1]


@r.put('/playlist/{playlist_id}/tags')
async def update_tags(playlist_id: int, tag_ids: List[int], db=Depends(get_db), user=Depends(get_current_user)):
    try:
        result = crud_playlist.update_tags(db, playlist_id, tag_ids)
        return result
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))


@r.put('/files/{file_id}')
async def update_file(file_id: int, name: str = Body(..., embed=True), db=Depends(get_db), user=Depends(get_current_user)):
    try:
        result = crud_file.update_file(db, file_id, name)
        return result
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))
