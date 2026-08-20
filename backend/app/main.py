from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import chats
from app.core.config import settings

app = FastAPI(title="InterAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chats.router, prefix="/api/chats", tags=["chats"])


@app.get("/health")
def health():
    return {"status": "ok"}
