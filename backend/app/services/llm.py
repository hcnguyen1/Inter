import json
import re
from openai import OpenAI

from app.core.config import settings
from app.schemas.chat import Message
from app.services.tools import TOOL_MAP, TOOLS_SCHEMA, execute_tool_call

_client = OpenAI(api_key=settings.llm_api_key, base_url=settings.llm_base_url)

SYSTEM_PROMPT = (
    "You are InterAI, a helpful, conversational assistant. "
    "You also have file tools: `list_files`, `read_file`, and `write_file`, scoped to a workspace. "
    "Only use a tool when the user explicitly asks you to read, write, edit, create, save, or list "
    "a file. For everything else (greetings, general questions, facts, jokes, math, opinions, etc.), "
    "respond directly in plain conversational language and do not call any tool."
)


def _extract_fallback_tool_call(content: str) -> tuple[str, dict] | None:
    """Some smaller/local models emit a tool call as raw JSON text instead of using
    the structured tool_calls field. Try to recover a usable call from that text."""
    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        return None

    raw = re.sub(r",\s*([}\]])", r"\1", match.group(0))  # drop trailing commas
    try:
        parsed = json.loads(raw)
    except ValueError:
        return None

    if not isinstance(parsed, dict):
        return None

    name = parsed.get("name")
    args = parsed.get("parameters") or parsed.get("arguments")
    if name not in TOOL_MAP or not isinstance(args, dict):
        return None

    return name, args


def _looks_like_tool_call(content: str) -> bool:
    """Heuristic for 'the model tried to call a tool but the JSON came out broken',
    so we never show raw/malformed JSON to the user."""
    stripped = content.strip()
    return stripped.startswith("{") and '"name"' in stripped


def get_completion(messages: list[Message], max_steps: int = 5) -> str:
    api_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[{"role": m.role, "content": m.content} for m in messages],
    ]

    msg = None
    for _ in range(max_steps):
        try:
            response = _client.chat.completions.create(
                model=settings.llm_model,
                messages=api_messages,
                tools=TOOLS_SCHEMA,
            )
        except Exception:
            response = _client.chat.completions.create(
                model=settings.llm_model,
                messages=api_messages,
            )

        choice = response.choices[0]
        msg = choice.message

        if not msg.tool_calls:
            fallback = _extract_fallback_tool_call(msg.content or "")
            if fallback is not None:
                name, args = fallback
                tool_result = execute_tool_call(name, json.dumps(args))
                api_messages.append({"role": "assistant", "content": msg.content or ""})
                api_messages.append({
                    "role": "user",
                    "content": (
                        f"[Tool '{name}' executed. Result: {tool_result}]\n"
                        "Reply to the user in plain language based on this result. "
                        "Do not output JSON or mention tool names."
                    ),
                })
                continue

            if _looks_like_tool_call(msg.content or ""):
                # The model attempted a tool call but produced malformed JSON; ask it to retry
                # instead of ever showing broken JSON to the user.
                api_messages.append({"role": "assistant", "content": msg.content or ""})
                api_messages.append({
                    "role": "user",
                    "content": (
                        "That response was not valid and could not be executed. "
                        "Please try again: either call the tool correctly, or answer in plain text."
                    ),
                })
                continue

            return msg.content or ""

        tool_calls_data = [
            {
                "id": tc.id,
                "type": "function",
                "function": {
                    "name": tc.function.name,
                    "arguments": tc.function.arguments,
                },
            }
            for tc in msg.tool_calls
        ]
        api_messages.append({
            "role": "assistant",
            "content": msg.content or "",
            "tool_calls": tool_calls_data,
        })

        for tool_call in msg.tool_calls:
            tool_result = execute_tool_call(
                tool_call.function.name,
                tool_call.function.arguments,
            )
            api_messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": tool_result,
            })

    return msg.content or "" if msg else ""
