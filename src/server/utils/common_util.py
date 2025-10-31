import logging

from fastapi import Request
from sqlalchemy.orm import Session

from src.server.models.user import OperationLog, User


def log_operation(
    db: Session,
    user_id: int,
    operation: str,
    details: str = None,
    request: Request = None,
):
    """记录用户操作日志"""
    ip_address = None
    if request:
        ip_address = request.client.host if request.client else None

    log = OperationLog(
        user_id=user_id, operation=operation, details=details, ip_address=ip_address
    )
    db.add(log)
    db.commit()
