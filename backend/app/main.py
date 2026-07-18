from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("STEP 1: Starting imports", flush=True)

from app.core.config import settings
print("STEP 2: Settings imported", flush=True)

from app.database.database import Base, engine
print("STEP 3: Database imported", flush=True)

import app.database.base
print("STEP 4: Database models imported", flush=True)

from app.api.auth import router as auth_router
print("STEP 5: Auth router imported", flush=True)

from app.api.memory import router as memory_router
print("STEP 6: Memory router imported", flush=True)

from app.api.chat import router as chat_router
print("STEP 7: Chat router imported", flush=True)

print("STEP 8: Creating database tables", flush=True)
Base.metadata.create_all(bind=engine)
print("STEP 9: Database tables ready", flush=True)

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

app.include_router(memory_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

@app.get("/")
def home():
    return {
        "message": "OmniMemory API Running 🚀"
    }

print("STEP 10: FastAPI application ready", flush=True)
