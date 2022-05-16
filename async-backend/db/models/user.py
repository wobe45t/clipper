from sqlalchemy import Column, Integer, String
from db.config import Base

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)


    # required in order to access columns with server defaults
    # or SQL expression defaults, subsequent to a flush, without
    # triggering an expired load
    # __mapper_args__ = {"eager_defaults": True}