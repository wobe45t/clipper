import uvicorn
from fastapi import FastAPI
import argparse
from db.config import engine, Base
from routers.user_router import router as user_router
from routers.playlist_router import router as playlist_router
from routers.clip_router import router as clip_router
from routers.tag_router import router as tag_router 
import os

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix='/api')
app.include_router(playlist_router, prefix='/api')
app.include_router(clip_router, prefix='/api')
app.include_router(tag_router, prefix='/api')

parser = argparse.ArgumentParser(description='fastapi')
parser.add_argument('-c', '--clear', action='store_true', default=False)
args, unknown = parser.parse_known_args()

@app.on_event("startup")
async def startup():
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'google_credentials.json'
    # create db tables
    async with engine.begin() as conn:
        if args.clear:
            await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == '__main__':
    uvicorn.run("main:app", port=5000, host='0.0.0.0', reload=True)
