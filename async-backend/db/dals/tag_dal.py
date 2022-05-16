from typing import List

from sqlalchemy.future import select
from sqlalchemy.orm import Session

from db.models.tag import Tag
from db.schemas.tag import TagResponse, TagCreate


class TagDAL():
    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def get_tags(self, user_id: int) -> List[TagResponse]:
        q = await self.db_session.execute(select(Tag).where(Tag.user_id == user_id))
        return q.scalars().unique().all()

    async def add_tag(self, tag: TagCreate) -> bool:
        try:
            print('tag : ', tag)
            new_tag = Tag(user_id=tag.user_id, name=tag.name, color=tag.color)
            self.db_session.add(new_tag)  # Just add a file to the session.
            # await self.db_session.flush()
            await self.db_session.commit()
            return new_tag
        except Exception as e:
            print('error : ', e)

    async def delete_tag(self, tag_id: int):
        q = await self.db_session.execute(select(Tag).where(Tag.id == tag_id))
        await self.db_session.delete(q)
        await self.db_session.commit()
