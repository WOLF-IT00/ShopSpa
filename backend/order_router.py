from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user, get_current_user_required, require_admin
from database import get_db
from models import Order, OrderItem, OrderStatus, PaymentStatus, Product, User, UserRole
from schemas import OrderCreate, OrderItemResponse, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


def _to_order_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        total=order.total,
        status=order.status.value,
        payment_status=order.payment_status.value,
        payment_method=order.payment_method,
        full_name=order.full_name,
        phone=order.phone,
        email=order.email,
        booking_date=order.booking_date,
        booking_time=order.booking_time,
        note=order.note,
        created_at=order.created_at,
        items=[
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name if item.product else "",
                quantity=item.quantity,
                price=item.price,
            )
            for item in order.items
        ],
    )


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    total = 0
    order_items = []

    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found",
            )
        line_total = product.price * item.quantity
        total += line_total
        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
        )

    order = Order(
        user_id=current_user.id if current_user else None,
        total=total,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.UNPAID,
        full_name=order_in.full_name,
        phone=order_in.phone,
        email=order_in.email,
        booking_date=order_in.booking_date,
        booking_time=order_in.booking_time,
        note=order_in.note,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return _to_order_response(order)


@router.get("", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_required),
):
    query = db.query(Order)
    if user.role != UserRole.ADMIN:
        query = query.filter(Order.user_id == user.id)

    orders = query.order_by(Order.created_at.desc()).all()
    return [_to_order_response(order) for order in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_required),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if user.role != UserRole.ADMIN and order.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    return _to_order_response(order)
