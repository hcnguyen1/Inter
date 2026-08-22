from openai import OpenAI

from app.core.config import settings
from app.schemas.chat import Message

_client = OpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)


def get_completion(messages: list[Message]) -> str:
    response = _client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": m.role, "content": m.content} for m in messages],
    )
    return response.choices[0].message.content or ""
