from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base, engine
from app.api.auth import router as auth_router
from app.api.memory import router as memory_router
from app.api.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

import app.database.base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://YOUR-NETLIFY-SITE.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    memory_router,
    prefix="/api/v1"
)

app.include_router(
    chat_router,
    prefix="/api"
)

app.include_router(
    auth_router,
    prefix="/api"
)

@app.get("/")
def home():
    return {
        "message": "OmniMemory API Running 🚀"
    }