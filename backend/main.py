from fastapi import FastAPI, Request, Depends
import uvicorn
import os 
from app.db.session import init_database
from app.api.routers.user import user_router
from app.api.routers.auth import auth_router
from app.api.routers.playlist import playlist_router
from app.api.routers.clip import clip_router
from app.api.routers.tag import tag_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title='backend', docs_url="/api/docs", openapi_url="/api"
)

domain = os.environ.get('DOMAIN')
print(domain)

origins = [
    domain,
    'http://ec2-3-126-92-162.eu-central-1.compute.amazonaws.com',
    "http://localhost:3000",
    "http://localhost:80",
    "localhost",
    "localhost:3000",
    "http://127.0.0.1:*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "PUT", "GET", "DELETE"],
    allow_headers=["Content-Type", "Authorization"]
)

app.include_router(
    user_router,
    prefix="/api",
    tags=["users"],
)

app.include_router(
    tag_router,
    prefix="/api",
    tags=["tags"],
)

app.include_router(
    clip_router,
    prefix="/api",
    tags=["clips"],
)


app.include_router(
    playlist_router,
    prefix="/api",
    tags=["playlist"],
)

app.include_router(
    auth_router,
    prefix="/api",
    tags=["auth"],
)

@app.on_event("startup")
def startup():
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'google_credentials.json'
    init_database()

    

@app.get('/')
def main(request: Request):
    return "backend"

if __name__ == '__main__':
    uvicorn.run("main:app", port=5000, host="0.0.0.0", reload=True)
