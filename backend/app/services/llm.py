from openai import OpenAI

from app.core.config import settings
from app.schemas.chat import Message

_client = OpenAI(api_key=settings.llm_api_key, base_url=settings.llm_base_url)

# Tells the model how to signal generated files so the frontend can offer a download
# instead of just showing a code block. No server-side file writes are involved.
SYSTEM_PROMPT = (
    "You are InterAI, a helpful assistant. When the user asks you to write, create, "
    "generate, or produce a file (e.g. code, notes, a report, CSV data), respond with "
    "ONLY a single fenced code block whose opening fence is the literal text "
    "'file:' immediately followed by the filename, with no language name and no space "
    "in between. For example, if asked for a file named notes.txt, you must reply with "
    "exactly:\n"
    "```file:notes.txt\n"
    "<the file content goes here>\n"
    "```\n"
    "Do not write 'file' alone, do not add a space after the colon, and do not omit the "
    "filename or its extension. Only use this exact format when the user is asking for a "
    "file to be generated; use normal code blocks (e.g. ```python) for everything else."
)


def get_completion(messages: list[Message]) -> str:
    response = _client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": m.role, "content": m.content} for m in messages],
        ],
    )
    return response.choices[0].message.content or ""
