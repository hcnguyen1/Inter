from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    content: str


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Chat(BaseModel):
    id: int
    title: str
    messages: list[Message] = []


class ChatUpdate(BaseModel):
    title: str
