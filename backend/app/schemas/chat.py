from typing import Literal

from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class Chat(BaseModel):
    id: int
    title: str
    messages: list[Message] = []
