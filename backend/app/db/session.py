from sqlalchemy import create_engine,  MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core import config
import boto3

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

s3 = boto3.client('s3',
                  endpoint_url='https://s3.eu-central-1.amazonaws.com',
                  aws_access_key_id='',
                  aws_secret_access_key='',
                  region_name='eu-central-1')


# db dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """
    Initialize the database (create all the tables)
    """
    Base.metadata.create_all(engine)
