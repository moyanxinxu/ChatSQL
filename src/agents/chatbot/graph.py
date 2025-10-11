import os
import uuid
from pathlib import Path
from typing import Any

import aiosqlite
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver, aiosqlite
from langgraph.graph import END, START, MessagesState, StateGraph
from src.agents.registry import BaseAgent
from src.agents.chatbot import ChatbotConfiguration
from src.agents.util import load_chat_model
from src.config import Config as SystemConfig


class ChatBotAgent(BaseAgent):
    name = "对话机器人"
    description = "基础的对话机器人"
    config_schema = ChatbotConfiguration

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.graph = None
        self.workpath = Path(SystemConfig().save_path) / "agents" / self.id
        self.workpath.mkdir(parents=True, exist_ok=True)

    async def chat_node(
        self,
        state: MessagesState,
        config: RunnableConfig = None,
    ) -> dict[str, Any]:
        config = self.config_schema.from_runnable_config(
            config, module_name=self.module_name
        )

        model = load_chat_model(provider="google", model="gemini-2.5-flash")

        response = await model.ainvoke(
            [
                SystemMessage(content=config.system_prompt),
                *state["messages"],
            ]
        )
        return {"messages": [response]}

    async def get_graph(self):
        if self.graph:
            return self.graph

        workflow = StateGraph(MessagesState, config_schema=self.config_schema)
        workflow.add_node("chat_node", self.chat_node)
        workflow.add_edge(START, "chat_node")
        workflow.add_edge("chat_node", END)

        try:
            sqlite_checkpointer = AsyncSqliteSaver(await self.get_async_conn())
            graph = workflow.compile(checkpointer=sqlite_checkpointer)
            self.graph = graph
            return graph
        except Exception as e:
            graph = workflow.compile()
            self.graph = graph
            return graph

    async def get_async_conn(self) -> aiosqlite.Connection:
        """获取异步数据库连接"""
        return await aiosqlite.connect(os.path.join(self.workpath, "aio_history.db"))

    async def get_aio_memory(self) -> AsyncSqliteSaver:
        """获取异步存储实例"""
        return AsyncSqliteSaver(await self.get_async_conn())


async def main():
    agent = ChatBotAgent(config=ChatbotConfiguration())

    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    messages = [
        HumanMessage(content="你好！"),
    ]
    result = agent.stream_messages(messages, config_schema=config)
    async for r in result:
        print(r)


if __name__ == "__main__":
    import asyncio

    # main()
    asyncio.run(main())
