from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str


class Chat(BaseModel):
    id: int
    title: str
    messages: list[str] = []
