from dataclasses import dataclass, field

from src.agents.registry import Configuration


@dataclass(kw_only=True)
class ChatbotConfiguration(Configuration):
    """Chatbot 的配置

    配置说明：

    metadata 中 configurable 为 True 的配置项可以被用户配置，
    configurable 为 False 的配置项不能被用户配置，只能由开发者预设。
    除非显示配置为 False，否则所有配置项都默认可配置。
    """

    system_prompt: str = field(
        default="You are a helpful assistant.",
        metadata={"name": "系统提示词", "description": "用来描述智能体的角色和行为"},
    )

    provider: str = field(
        default="siliconflow",
        metadata={
            "name": "大模型提供商",
            "description": "大模型提供商",
        },
    )

    model: str = field(
        default="Qwen/Qwen3-8B",
        metadata={
            "name": "模型",
            "description": "模型名称，不同提供商的模型名称不同",
        },
    )

    tools: list[str] = field(
        default_factory=list,
        metadata={
            "name": "工具",
            "description": "工具列表",
        },
    )
