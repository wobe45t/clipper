from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
import boto3

DATABASE_URI = "postgresql+asyncpg://root:root@localhost/test"

engine = create_async_engine(DATABASE_URI, future=True, echo=True)
async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

s3 = boto3.client('s3',
                  endpoint_url='http://192.168.0.3:9000',
                  aws_access_key_id='minio',
                  aws_secret_access_key='minio123',
                  region_name='my-region')
