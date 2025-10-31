from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.server.models import Base


class User(Base):
    """用户模型"""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(
        String, nullable=False, default="user"
    )  # 角色: superadmin, admin, user
    created_at = Column(DateTime, default=func.now())
    last_login = Column(DateTime, nullable=True)

    # 关联操作日志
    operation_logs = relationship("OperationLog", back_populates="user")

    def to_dict(self, include_password=False):
        result = {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }
        if include_password:
            result["password_hash"] = self.password_hash
        return result


# 请求和响应模型
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"


class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    role: str | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: str
    last_login: str | None = None


class InitializeAdmin(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class OperationLog(Base):
    """操作日志模型"""

    __tablename__ = "operation_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    operation = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=func.now())

    # 关联用户
    user = relationship("User", back_populates="operation_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "operation": self.operation,
            "details": self.details,
            "ip_address": self.ip_address,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
