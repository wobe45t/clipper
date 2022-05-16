from sqlalchemy import Integer, String, Column, Boolean, ForeignKey , Table, DateTime
from sqlalchemy.orm import relationship,  backref
from .session import Base
from sqlalchemy.dialects.postgresql import ARRAY

class File(Base):
    __tablename__ = 'file'

    id = Column(Integer, primary_key=True)
    playlist_id = Column(Integer, ForeignKey('playlist.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    duration = Column(Integer)
    bit_rate = Column(Integer)
    name = Column(String)
    clips = relationship('Clip', lazy='joined')


association_table = Table('playlist_tag_association', Base.metadata,
    Column('playlist_id', ForeignKey('playlist.id')),
    Column('tag_id', ForeignKey('tag.id'))
)

class Playlist(Base):
    __tablename__ = 'playlist'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey('user.id'))

    tags = relationship('Tag', secondary=association_table, lazy='joined')

    files = relationship('File', cascade='all, delete', backref='playlist', lazy='joined', order_by=File.name)


class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))

    name = Column(String, unique=True)
    color = Column(String)

class Clip(Base):
    __tablename__ = 'clip'

    id = Column(Integer, primary_key=True)
    text = Column(String)
    note = Column(String)
    date = Column(DateTime)
    seconds = Column(Integer)
    file_id = Column(Integer, ForeignKey('file.id'))

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    is_superuser = Column(Boolean, default=False)
