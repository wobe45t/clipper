from sqlalchemy import Integer, String, Column, Boolean, ForeignKey , Table, DateTime
from sqlalchemy.orm import relationship
from db.config import Base
from .clip import Clip

class File(Base):
    __tablename__ = 'file'

    id = Column(Integer, primary_key=True)
    playlist_id = Column(Integer, ForeignKey('playlist.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    duration = Column(Integer)
    bit_rate = Column(Integer)
    name = Column(String)
    clips = relationship(Clip, lazy='joined')