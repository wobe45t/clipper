from typing import List, Optional

from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from db.models.playlist import Playlist
from db.models.file import File
from db.models.tag import Tag
from db.schemas.playlist import PlaylistResponse


class PlaylistDAL():
    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def get_playlist(self, playlist_id: int) -> Playlist:
        q = await self.db_session.execute(select(Playlist).where(Playlist.id == playlist_id))
        return q.scalars().first()

    async def get_playlists(self, user_id: int) -> List[PlaylistResponse]:
        q = await self.db_session.execute(select(Playlist).where(Playlist.user_id == user_id))
        return q.scalars().unique().all()

    async def get_playlist_files(self, playlist_id: int) -> List[File]:
        q = await self.db_session.execute(select(File).where(File.playlist_id == playlist_id))
        return q.scalars().unique()

    async def update_playlist(self, playlist_id: int, name: str):
        q = update(Playlist).where(Playlist.id == playlist_id)
        if name:
            q = q.values(name=name)
        q.execution_options(synchronize_session="fetch")
        await self.db_session.execute(q)
        return True

    async def delete_playlist(self, playlist_id: int):
        q = await self.db_session.execute(select(Playlist).where(Playlist.id == playlist_id))
        await self.db_session.delete(q)

        await self.db_session.commit()

    async def create_playlist(self, name: str, user_id: int):
        new_playlist = Playlist(name=name, user_id=user_id)
        self.db_session.run_sync(self.db_session.add(new_playlist))
        await self.db_session.flush()
        await self.db_session.commit()
        return new_playlist

    async def update_tags(self, playlist_id: int, tags: List[int]):
        q = update(Playlist).where(Playlist.id == playlist_id)
        tags_db = await self.db_session.execute(select(Tag).where(Tag.id.in_(tags)))
        q = q.values(tags=tags)

        q.execution_options(synchronize_session="fetch")
        await self.db_session.execute(q)
        self.db_session.commit()
        return True

        # playlist_db = db.query(Playlist).filter(Playlist.id == playlist_id).one()
        # print(tags_db)
        # playlist_db.tags = tags_db
        # db.commit()
        # return "OK"
