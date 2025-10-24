from dataclasses import dataclass, field

from src.agents.registry import Configuration


@dataclass(kw_only=True)
class WeatherBotConfiguration(Configuration):
    """天气查询智能体的配置

    配置说明：

    metadata 中 configurable 为 True 的配置项可以被用户配置，
    configurable 为 False 的配置项不能被用户配置，只能由开发者预设。
    除非显示配置为 False，否则所有配置项都默认可配置。
    """

    system_prompt: str = field(
        default="你是一个职责为天气查询的助手，但是你仍然能够回答非查询相关的问题，你需要辨别用户是查询天气的还是其他问题，如果是查询天气，你需要提取出地点信息，并调用天气查询工具，如果不是查询天气的话，就直接回答，你需要客观准确地回答用户的问题。",
        metadata={"name": "系统提示词", "description": "用来描述智能体的角色和行为"},
    )

    provider: str = field(
        default="google",
        metadata={
            "name": "大模型提供商",
            "description": "大模型提供商",
        },
    )

    model: str = field(
        default="gemini-2.5-flash",
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
