from fastapi import APIRouter, HTTPException

from app.schemas.chat import Chat, ChatUpdate, Message, MessageCreate
from app.services.llm import get_completion

router = APIRouter()

# In-memory store as a placeholder until a real database is wired up.
_chats: dict[int, Chat] = {}
_next_id = 1


@router.get("", response_model=list[Chat])
def list_chats():
    return list(_chats.values())


@router.post("", response_model=Chat)
def create_chat():
    global _next_id
    chat = Chat(id=_next_id, title="New Chat", messages=[])
    _chats[chat.id] = chat
    _next_id += 1
    return chat


@router.delete("/{chat_id}")
def delete_chat(chat_id: int):
    if chat_id not in _chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    del _chats[chat_id]
    return {"ok": True}


@router.patch("/{chat_id}", response_model=Chat)
def rename_chat(chat_id: int, update: ChatUpdate):
    chat = _chats.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    chat.title = update.title
    return chat


@router.post("/{chat_id}/messages", response_model=Chat)
def add_message(chat_id: int, message: MessageCreate):
    chat = _chats.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.messages.append(Message(role="user", content=message.content))

    try:
        reply = get_completion(chat.messages)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {exc}") from exc

    chat.messages.append(Message(role="assistant", content=reply))
    return chat
