import json
from datetime import datetime

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessageChunk, HumanMessage
from sqlalchemy.orm import Session

from src.agents.agent_manager import agent_manager
from src.server.models.thread import Thread, ThreadCreate
from src.server.utils.auth_middleware import get_db

chat = APIRouter(prefix="/chat", tags=["chat"])


@chat.get("/agent")
async def get_agent():
    agents = await agent_manager.get_agents_info()
    # logger.debug(f"agents: {agents}")
    return agents


@chat.get("/agent/{agent_id}/history")
async def get_agent_history(agent_id: str, thread_id: str):
    """获取智能体历史消息（需要登录）"""
    try:
        # 获取Agent实例和配置类
        agent = agent_manager.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail=f"智能体 {agent_id} 不存在")

        # 获取历史消息
        history = await agent.get_history(thread_id=thread_id)
        return {"history": history}

    except Exception as e:
        # logger.error(f"获取智能体历史消息出错: {e}, {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"获取智能体历史消息出错: {str(e)}")


@chat.delete("/thread/{thread_id}")
async def delete_thread(thread_id: str, db: Session = Depends(get_db)):
    """删除对话线程"""
    thread = db.query(Thread).filter(Thread.id == thread_id).first()

    if not thread:
        raise HTTPException(status_code=404, detail="对话线程不存在")

    # 软删除
    thread.status = 0
    db.commit()

    return {"message": "删除成功"}


@chat.post("/thread")
async def create_thread(thread: ThreadCreate, db: Session = Depends(get_db)):
    """创建新对话线程"""

    fmt = "%Y-%m-%dT%H:%M:%S.%f%z"

    thread = Thread(**thread.model_dump())

    thread.create_at = datetime.strptime(thread.create_at, fmt)
    thread.update_at = datetime.strptime(thread.update_at, fmt)

    db.add(thread)
    db.commit()
    db.refresh(thread)

    return thread


@chat.delete("/thread/{thread_id}/all")
async def remove_all_thread(thread_id: str, agent_id: str | None = None):
    """删除所有对话线程"""
    agent = agent_manager.get_agent(agent_id)

    await agent.remove_all_history(thread_id=thread_id)

    return {"message": "删除成功"}


@chat.post("/agent/{agent_id}")
async def chat_agent(
    agent_id: str,
    thread_id: str = Body(...),
    query: str = Body(...),
):
    """与特定的智能体进行对话"""
    pass

    def make_chunk(content=None, **kwargs):
        return (
            json.dumps(
                {
                    "content": content,
                    **kwargs,
                },
                ensure_ascii=False,
            ).encode("utf-8")
            + b"\n"
        )

    async def stream_messages():
        configurable = {"thread_id": thread_id}
        # 代表服务端已经收到了请求
        yield make_chunk(
            status="init",
            content="",
            configurable=configurable,
            type="ai",
        )

        try:
            agent = agent_manager.get_agent(agent_id)
        except Exception as e:
            yield make_chunk(
                message=f"Error getting agent {agent_id}: {e}", status="error"
            )
            return

        messages = HumanMessage(content=query)

        try:
            async for msg, metadata in agent.stream_messages(messages, configurable):
                if isinstance(msg, AIMessageChunk):
                    yield make_chunk(content=msg.content, status="loading", configurable=configurable, type='ai') # fmt: skip
                else:
                    yield make_chunk(
                        status="loading",
                        configurable=configurable,
                        type="ai",
                    )

            yield make_chunk(
                content="",
                status="finished",
                configurable=configurable,
                type="ai",
            )
        except Exception as e:
            yield make_chunk(
                message=f"Error streaming messages: {e}",
                status="error",
                configurable=configurable,
            )

    return StreamingResponse(stream_messages(), media_type="application/json")


@chat.get("/threads")
async def list_threads(
    agent_id: str | None = None,
    db: Session = Depends(get_db),
):
    """获取用户的所有对话线程"""
    query = db.query(Thread).filter(Thread.status == 1)
    if agent_id:
        query = query.filter(Thread.agent_id == agent_id)

    threads = query.order_by(Thread.update_at.desc()).all()

    return [
        {
            "id": thread.id,
            "agent_id": thread.agent_id,
            "title": thread.title,
            "description": thread.description,
            "create_at": thread.create_at.isoformat(),
            "update_at": thread.update_at.isoformat(),
        }
        for thread in threads
    ]
