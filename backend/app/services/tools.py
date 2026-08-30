import json
from pathlib import Path

# Dedicated workspace directory for file tools
WORKSPACE_DIR = Path(__file__).resolve().parent.parent.parent / "workspace"
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)


def _safe_path(filename: str) -> Path:
    clean_name = Path(filename).name
    path = (WORKSPACE_DIR / clean_name).resolve()
    if not path.is_relative_to(WORKSPACE_DIR.resolve()):
        raise ValueError("Access outside workspace is forbidden")
    return path


def read_file(filename: str) -> str:
    """Read the full text content of a file in the workspace."""
    try:
        file_path = _safe_path(filename)
        if not file_path.exists():
            return f"Error: File '{filename}' not found in workspace."
        return file_path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"Error reading file '{filename}': {e}"


def write_file(filename: str, content: str) -> str:
    """Write or overwrite a file in the workspace with content."""
    try:
        file_path = _safe_path(filename)
        file_path.write_text(content, encoding="utf-8")
        return f"Successfully wrote {len(content)} characters to '{filename}'."
    except Exception as e:
        return f"Error writing file '{filename}': {e}"


def list_files() -> str:
    """List all files in the workspace."""
    try:
        files = [f.name for f in WORKSPACE_DIR.iterdir() if f.is_file()]
        if not files:
            return "Workspace is currently empty."
        return "Files in workspace:\n" + "\n".join(f"- {name}" for name in files)
    except Exception as e:
        return f"Error listing workspace files: {e}"


TOOL_MAP = {
    "read_file": read_file,
    "write_file": write_file,
    "list_files": list_files,
}

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the text content of a file in the workspace.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The filename to read (e.g., 'notes.txt', 'main.py').",
                    }
                },
                "required": ["filename"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Create or overwrite a file in the workspace with content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The filename to create or update.",
                    },
                    "content": {
                        "type": "string",
                        "description": "The exact content to write into the file.",
                    },
                },
                "required": ["filename", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_files",
            "description": "List all files available in the workspace.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
]


def execute_tool_call(tool_name: str, arguments_json: str) -> str:
    func = TOOL_MAP.get(tool_name)
    if not func:
        return f"Error: Unknown tool '{tool_name}'"
    try:
        kwargs = json.loads(arguments_json) if arguments_json else {}
    except Exception as e:
        return f"Error parsing tool arguments: {e}"

    try:
        return func(**kwargs)
    except TypeError as e:
        return f"Error: invalid arguments for tool '{tool_name}': {e}"
