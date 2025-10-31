from fastapi import APIRouter

from .auth_router import auth
from .chat_router import chat
from .system_router import system

router = APIRouter()

# 注册路由结构
router.include_router(auth)
router.include_router(chat)
router.include_router(system)
