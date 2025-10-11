from fastapi import APIRouter

from .chat_router import chat

router = APIRouter()

# 注册路由结构
router.include_router(chat)  # /api/chat/*
