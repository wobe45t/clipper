from sqlalchemy import Column, Integer, String, Table, ForeignKey
from db.config import Base
from sqlalchemy.orm import relationship, backref
from .file import File
from .tag import Tag


association_table = Table('playlist_tag_association', Base.metadata,
    Column('playlist_id', ForeignKey('playlist.id')),
    Column('tag_id', ForeignKey(Tag.id))
)

class Playlist(Base):
    __tablename__ = 'playlist'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey('user.id'))

    tags = relationship('Tag', secondary=association_table, lazy='joined')

    files = relationship('File', cascade='all, delete', backref='playlist', cascade_backrefs=True, lazy='joined', order_by=File.name)
