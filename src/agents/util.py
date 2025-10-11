import os

from langchain_openai import ChatOpenAI
from pydantic import SecretStr


def load_chat_model(provider: str, model: str) -> ChatOpenAI:
    """加载大模型客户端"""
    if provider == "siliconflow":
        from langchain_openai import ChatOpenAI

        api_key = os.getenv("SILICONFLOW_API_KEY")
        base_url = os.getenv("SILICONFLOW_BASE_URL")

        return ChatOpenAI(
            model=model,
            api_key=SecretStr(api_key),
            base_url=base_url,
        )

    if provider == "google":
        from langchain_openai import ChatOpenAI

        api_key = os.getenv("GOOGLE_API_KEY")
        base_url = os.getenv("GOOGLE_BASE_URL")

        return ChatOpenAI(
            model=model,
            api_key=SecretStr(api_key),
            base_url=base_url,
        )


def load_embed_model(provider: str, model: str):
    """加载嵌入模型客户端"""
    if provider == "siliconflow":
        from langchain_openai import OpenAIEmbeddings

        api_key = os.getenv("SILICONFLOW_API_KEY")
        base_url = os.getenv("SILICONFLOW_BASE_URL")

        return OpenAIEmbeddings(
            model=model,
            api_key=SecretStr(api_key),
            base_url=base_url,
        )
