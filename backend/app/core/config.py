from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cors_origins: list[str] = ["http://localhost:3000"]

    # OpenAI-compatible provider config (works with OpenAI, Groq, Together, OpenRouter, etc.)
    openai_api_key: str = ""
    openai_base_url: str | None = None
    openai_model: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"


settings = Settings()
