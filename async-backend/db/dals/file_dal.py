from typing import List, Optional

from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from db.models.clip import Clip
from db.models.file import File
from db.schemas.file import File as FileSchema
import logging 

class FileDAL():
    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def create_file(self, playlist_id: int, duration: int, bit_rate: int, user_id: int, name: str):
        try:
            new_file = File(playlist_id=playlist_id,
                            duration=duration,
                            bit_rate=bit_rate,
                            user_id=user_id,
                            name=name
            )
            self.db_session.add(new_file) # Just add a file to the session.
            await self.db_session.flush() # Flush object so new_file will have an id from the database.
            # It cannot be commited here because only one commit per session.begin is allowed. Since I initailize whole file dal object
            # and iterate over all the files in request I cannot commit because it will cause the session to break after first file.
            return new_file 
        except Exception as e:
            logging.error(f"File creation failed: {str(e)}")



    async def create_clip(self, seconds: int, text: str, file_id: int):
        new_clip = Clip(seconds=seconds, text=text, file_id=file_id)
        self.db_session.add(new_clip)

        # self.db_session.run_sync(self.db_session.add(new_playlist))
        await self.db_session.flush()
        await self.db_session.commit()
        return new_clip

    async def get_file(self, file_id: int) -> Optional[FileSchema]:
        q = await self.db_session.execute(select(File).where(File.id == file_id))
        # print(q.first())
        return q.scalar()