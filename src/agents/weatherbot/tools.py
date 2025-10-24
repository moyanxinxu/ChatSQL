from langchain_core.tools import tool


@tool
def get_weather(location: str) -> str:
    """
    根据地点获取天气信息。
    参数:
        location (str): 查询天气的地点。
    返回:
        str: 天气信息描述。
    """
    return f"[{location}]的天气是晴转酸雨！"


tools = [get_weather]
