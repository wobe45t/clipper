from db.config import async_session
from db.dals.user_dal import UserDAL
from db.dals.playlist_dal import PlaylistDAL
from db.dals.file_dal import FileDAL
from db.dals.tag_dal import TagDAL

async def get_user_dal():
    async with async_session() as session:
        async with session.begin():
            yield UserDAL(session)

async def get_playlist_dal():
    async with async_session() as session:
        async with session.begin():
            yield PlaylistDAL(session)

async def get_file_dal():
    async with async_session() as session:
        async with session.begin():
            yield FileDAL(session)

async def get_tag_dal():
    async with async_session() as session:
        async with session.begin():
            yield TagDAL(session)