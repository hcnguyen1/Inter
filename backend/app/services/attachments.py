from io import BytesIO

from pypdf import PdfReader

MAX_CHARS = 20_000


def extract_text(filename: str, content: bytes) -> str:
    """Extract readable text from an uploaded file, truncated to a safe context size."""
    if filename.lower().endswith(".pdf"):
        text = _extract_pdf_text(content)
    else:
        text = content.decode("utf-8", errors="replace")

    if len(text) > MAX_CHARS:
        text = text[:MAX_CHARS] + "\n...[truncated]"
    return text


def _extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    return "\n\n".join(page.extract_text() or "" for page in reader.pages)
