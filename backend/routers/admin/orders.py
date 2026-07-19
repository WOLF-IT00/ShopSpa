from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from auth import require_admin
from database import get_db
from models import Order, OrderItem, OrderStatus, OrderStatusLog, PaymentStatus, User
from order_router import _to_order_response
from schemas import (
    OrderDetailResponse,
    OrderResponse,
    OrderStatusLogResponse,
    OrderStatusUpdate,
    PaymentStatusUpdate,
)

router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])

ADMIN_STATUS_TRANSITIONS: dict[OrderStatus, set[OrderStatus]] = {
    OrderStatus.PENDING: {OrderStatus.CONFIRMED, OrderStatus.CANCELLED},
    OrderStatus.CONFIRMED: {OrderStatus.COMPLETED, OrderStatus.CANCELLED},
}


def _pages(total: int, size: int) -> int:
    return max(1, ceil(total / size)) if size else 1


def _order_query(db: Session):
    return db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product),
        joinedload(Order.status_logs),
    )


def _log_order_change(
    db: Session,
    order_id: int,
    action: str,
    new_value: str,
    old_value: str | None = None,
    note: str | None = None,
    created_by: str | None = None,
) -> None:
    log = OrderStatusLog(
        order_id=order_id,
        action=action,
        old_value=old_value,
        new_value=new_value,
        note=note,
        created_by=created_by,
    )
    db.add(log)


def _to_order_detail(order: Order) -> OrderDetailResponse:
    base = _to_order_response(order)
    logs = sorted(order.status_logs, key=lambda log: log.created_at)
    return OrderDetailResponse(
        **base.model_dump(),
        status_logs=[OrderStatusLogResponse.model_validate(log) for log in logs],
    )


@router.get("")
def list_orders(
    q: str = "",
    date: str = "",
    status_filter: str = Query("", alias="status"),
    payment_status: str = Query("", alias="payment_status"),
    sort: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = _order_query(db)

    if q.strip():
        if q.strip().isdigit():
            query = query.filter(Order.id == int(q.strip()))
        else:
            term = f"%{q.strip()}%"
            query = query.filter(
                (Order.full_name.ilike(term))
                | (Order.email.ilike(term))
                | (Order.phone.ilike(term))
            )

    if date.strip():
        query = query.filter(Order.booking_date == date.strip())

    if status_filter.strip():
        try:
            query = query.filter(Order.status == OrderStatus(status_filter.strip()))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status filter")

    if payment_status.strip():
        try:
            query = query.filter(
                Order.payment_status == PaymentStatus(payment_status.strip())
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payment status filter")

    total = query.count()
    order_by = Order.created_at.desc() if sort == "desc" else Order.created_at.asc()
    orders = (
        query.order_by(order_by)
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "items": [_to_order_response(order) for order in orders],
        "meta": {
            "total": total,
            "page": page,
            "size": size,
            "pages": _pages(total, size),
        },
    }


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = _order_query(db).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _to_order_detail(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    order = _order_query(db).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        new_status = OrderStatus(payload.status.strip().upper())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

    old_status = order.status
    if old_status == new_status:
        return _to_order_response(order)

    allowed = ADMIN_STATUS_TRANSITIONS.get(old_status, set())
    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {old_status.value} to {new_status.value}",
        )

    order.status = new_status
    _log_order_change(
        db,
        order_id=order.id,
        action="STATUS_CHANGE",
        old_value=old_status.value,
        new_value=new_status.value,
        created_by=admin.email,
    )
    db.commit()
    db.refresh(order)
    return _to_order_response(order)


@router.patch("/{order_id}/payment", response_model=OrderResponse)
def update_payment_status(
    order_id: int,
    payload: PaymentStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        new_payment = PaymentStatus(payload.payment_status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payment status")

    old_payment = order.payment_status.value
    if old_payment == new_payment.value:
        return _to_order_response(order)

    order.payment_status = new_payment
    _log_order_change(
        db,
        order_id=order.id,
        action="PAYMENT_CHANGE",
        old_value=old_payment,
        new_value=new_payment.value,
        created_by=admin.email,
    )
    db.commit()
    db.refresh(order)
    return _to_order_response(order)


@router.get("/{order_id}/history", response_model=list[OrderStatusLogResponse])
def get_order_history(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    logs = (
        db.query(OrderStatusLog)
        .filter(OrderStatusLog.order_id == order_id)
        .order_by(OrderStatusLog.created_at.asc())
        .all()
    )
    return [OrderStatusLogResponse.model_validate(log) for log in logs]


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
