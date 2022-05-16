from sqlalchemy import Integer, String, Column, ForeignKey
from db.config import Base

class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))

    name = Column(String, unique=True)
    color = Column(String)