from fastapi import APIRouter, Body, Depends

from src import config
from src.server.models.user import User
from src.server.utils.auth_middleware import get_admin_user

system = APIRouter(prefix="/system", tags=["system"])


@system.get("/health")
async def health_check():
    """系统健康检查接口（公开接口）"""
    return {"status": "ok", "message": "服务正常运行"}


@system.get("/config")
def get_config(current_user: User = Depends(get_admin_user)):
    """获取系统配置"""
    return config.dump_config()


@system.post("/config/update")
async def update_config_batch(items: dict = Body(...), current_user: User = Depends(get_admin_user)) -> dict: # fmt: skip
    """批量更新配置项"""
    config.update(items)
    config.save()
    return config.dump_config()
