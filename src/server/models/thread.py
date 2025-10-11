from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from src.server.models import Base


class Thread(Base):
    """对话线程表"""

    __tablename__ = "thread"

    agent_id = Column(String(64), index=True, nullable=False, comment="智能体ID")
    id = Column(String(64), primary_key=True, index=True, comment="线程ID")
    title = Column(String(255), nullable=True, comment="标题")
    create_at = Column(DateTime, default=func.now(), comment="创建时间")
    update_at = Column(DateTime, default=func.now(), onupdate=func.now(), comment="更新时间") # fmt: skip

    description = Column(String(255), nullable=True, comment="描述")
    status = Column(Integer, default=1, comment="状态")


class ThreadCreate(BaseModel):
    id: str
    agent_id: str
    title: str = ""
    description: str = ""
    create_at: str
    update_at: str
    status: int = 1
