from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from db.config import Base


class Clip(Base):
    __tablename__ = 'clip'

    id = Column(Integer, primary_key=True)
    text = Column(String)
    note = Column(String)
    date = Column(DateTime)
    seconds = Column(Integer)
    file_id = Column(Integer, ForeignKey('file.id'))