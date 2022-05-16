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

from db.dals.playlist_dal import PlaylistDAL
from db.dals.file_dal import FileDAL
from db.dals.user_dal import UserDAL

from db.models.playlist import Playlist
from db.models.file import File

from db.schemas.playlist import PlaylistResponse

from dependencies import get_playlist_dal, get_file_dal, get_user_dal

from db.config import s3

router = r = APIRouter()


@r.delete('/playlist/{playlist_id}')
async def delete_playlist(playlist_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal)):
    # playlist_db = playlist_dal.get_playlist(playlist_id)
    # if playlist_db.user_id != user.id:
    #     raise HTTPException(status.HTTP_401_BAD_REQUEST, detail='You are not authenticated to access that content')

    files = await playlist_dal.get_playlist_files(playlist_id)
    #TODO instead of this i could create a folder with playlist id for user and just delete whole folder instead of single files.
    for file in files:
        print(f'deleting file /{file.user_id}/{file.id}')
        try:
            s3.delete_object(Bucket='clipper-app',
                             Key=f'{file.user_id}/{file.id}')
        except Exception:
            print("Couldn't delete file in s3 ERROR")
    # should propagate and delete children
    result = await playlist_dal.delete_playlist(playlist_id)

    if not result:
        print("FINAL DELETE FAILED PLAYLIST ERROR")
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't delete playlist")

    return "OK"

# DEBUG


@r.get('/playlist/{playlist_id}/files')
async def get_playlist_files(playlist_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal)):
    playlists = await playlist_dal.get_playlist_files(playlist_id)
    if not playlists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't find playlist")
    return playlists


@r.get('/playlist/{playlist_id}')
async def get_playlist(playlist_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal)):
    response = await playlist_dal.get_playlist(playlist_id)
    if not response:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail="Couldn't find playlist")
    return response


@r.put('/playlist/{playlist_id}')
async def change_name(playlist_id: int = Path(...), name: str = Body(..., embed=True), playlist_dal: PlaylistDAL = Depends(get_playlist_dal)):
    response = await playlist_dal.update_playlist(playlist_id, name=name)
    return response


@r.post('/playlists/{user_id}/upload')
async def upload_files(
    request: Request,
    user_id: int = Path(...),
    name: str = Body(..., embed=True),
    files: List[UploadFile] = FileObject(...),
    playlist_dal: PlaylistDAL = Depends(get_playlist_dal),
    file_dal: FileDAL = Depends(get_file_dal),
    user_dal: UserDAL = Depends(get_user_dal),
):
    # if not request.headers['authorization']:
    #     raise HTTPException(status.HTTP_400_BAD_REQUEST)
    # token = request.headers['authorization'].split(' ')[1]
    # print(request.headers)
    # print('token: ', token)
    # await user_dal.get_current_user(token)

    playlist = await playlist_dal.create_playlist(user_id=user_id, name=name)
    for file in files:
        with NamedTemporaryFile('r+b') as f:

            f.write(file.file.read())
            info = mediainfo(f.name)
            # print(info)
            duration = info['duration']
            bit_rate = info['bit_rate']
            # print(duration, bit_rate)

            file_db = await file_dal.create_file(
                playlist_id=playlist.id,
                duration=ceil(float(duration)),
                bit_rate=int(bit_rate),
                user_id=user_id,
                name=file.filename
            )
            if file_db:
                print(file_db)
                s3.upload_file(f.name, "clipper-app",
                               f'{user_id}/{file_db.id}', ExtraArgs={'ContentType': 'audio/mpeg'})
            else:
                return HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return "OK"


@r.get('/playlists/{user_id}', response_model=List[PlaylistResponse])
async def get_playlists(user_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal)):
    try:
        files = await playlist_dal.get_playlists(user_id)
        return files
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            detail=str(e))


# TODO add query param of range - user will ask for specific location of the stream
@r.get('/stream/{file_id}')
async def stream(file_id: int = Path(...), file_dal: FileDAL = Depends(get_file_dal)):
    file = await file_dal.get_file(file_id)
    if not file:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="File not found")

    # TODO maybe it shouldnt remove the url each time but store it in db forever?
    # TODO or make a better streaming response

    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': 'clipper-app',
            'Key': f'{file.user_id}/{file.id}',
        },
        ExpiresIn=180
    )

    return RedirectResponse(url)


# # ADD TAG TO PLAYLIST
# @r.post('/playlist/{playlist_id}/tags/{tag_id}')
# async def add_tag(playlist_id: int = Path(...), tag_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal), user=Depends(get_current_user)):
#     result = crud_playlist.add_tag(db, playlist_id, tag_id)
#     return result

# # DELETE TAG FROM PLAYLIST


# @r.delete('/playlist/{playlist_id}/tags/{tag_id}')
# async def delete_tag(playlist_id: int = Path(...), tag_id: int = Path(...), playlist_dal: PlaylistDAL = Depends(get_playlist_dal), user=Depends(get_current_user)):
#     result = crud_playlist.delete_tag(db, playlist_id, tag_id)
    # return result


# @r.put('/playlist/{playlist_id}/tags')
# async def update_tags(playlist_id: int, tag_ids: List[int], playlist_dal: PlaylistDAL = Depends(get_playlist_dal), user=Depends(get_current_user)):
#     try:
#         result = crud_playlist.update_tags(db,playlist_id, tag_ids)
#         return result
#     except Exception as e:
#         raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))

# @r.put('/files/{file_id}')
# async def update_file(file_id: int, name: str = Body(..., embed=True), playlist_dal: PlaylistDAL = Depends(get_playlist_dal), user=Depends(get_current_user)):
#     try:
#         result = crud_file.update_file(db, file_id, name)
#         return result
#     except Exception as e:
#         raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))
