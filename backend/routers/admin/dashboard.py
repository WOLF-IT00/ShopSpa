from datetime import date, datetime, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Employee, Order, OrderItem, OrderStatus, PaymentStatus, Product, User, UserRole
from schemas import (
    DashboardBookingItem,
    DashboardChartPoint,
    DashboardCustomerItem,
    DashboardResponse,
    DashboardServiceItem,
    DashboardSummary,
)

router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])

Period = Literal["today", "7d", "30d", "month", "year", "custom"]


def _parse_date(value: str | None) -> date | None:
    if not value or not value.strip():
        return None
    return datetime.strptime(value.strip(), "%Y-%m-%d").date()


def _resolve_date_range(
    period: Period,
    start_date: str | None,
    end_date: str | None,
    month: int | None,
    year: int | None,
) -> tuple[datetime, datetime, datetime, datetime]:
    now = datetime.utcnow()
    today = now.date()

    if period == "today":
        start = datetime.combine(today, datetime.min.time())
        end = now
    elif period == "7d":
        start = datetime.combine(today - timedelta(days=6), datetime.min.time())
        end = now
    elif period == "30d":
        start = datetime.combine(today - timedelta(days=29), datetime.min.time())
        end = now
    elif period == "month":
        target_year = year or today.year
        target_month = month or today.month
        start = datetime(target_year, target_month, 1)
        if target_month == 12:
            end = datetime(target_year + 1, 1, 1) - timedelta(seconds=1)
        else:
            end = datetime(target_year, target_month + 1, 1) - timedelta(seconds=1)
    elif period == "year":
        target_year = year or today.year
        start = datetime(target_year, 1, 1)
        end = datetime(target_year, 12, 31, 23, 59, 59)
    elif period == "custom":
        parsed_start = _parse_date(start_date)
        parsed_end = _parse_date(end_date)
        if not parsed_start or not parsed_end:
            start = datetime.combine(today - timedelta(days=29), datetime.min.time())
            end = now
        else:
            start = datetime.combine(parsed_start, datetime.min.time())
            end = datetime.combine(parsed_end, datetime.max.time())
    else:
        start = datetime.combine(today - timedelta(days=29), datetime.min.time())
        end = now

    range_days = max((end - start).days, 1)
    prev_end = start - timedelta(seconds=1)
    prev_start = prev_end - timedelta(days=range_days)
    return start, end, prev_start, prev_end


def _trend_percent(current: float, previous: float) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


def _orders_in_range(db: Session, start: datetime, end: datetime):
    return db.query(Order).filter(
        Order.created_at >= start,
        Order.created_at <= end,
    )


def _paid_revenue(orders: list[Order]) -> int:
    return sum(
        order.total
        for order in orders
        if order.payment_status == PaymentStatus.PAID
    )


def _to_booking_item(order: Order) -> DashboardBookingItem:
    return DashboardBookingItem(
        id=order.id,
        full_name=order.full_name,
        email=order.email,
        total=order.total,
        status=order.status.value,
        payment_status=order.payment_status.value,
        booking_date=order.booking_date,
        booking_time=order.booking_time,
        created_at=order.created_at,
    )


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    period: Period = Query("30d"),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    start, end, prev_start, prev_end = _resolve_date_range(
        period, start_date, end_date, month, year
    )

    current_orders = _orders_in_range(db, start, end).all()
    previous_orders = _orders_in_range(db, prev_start, prev_end).all()

    current_revenue = _paid_revenue(current_orders)
    previous_revenue = _paid_revenue(previous_orders)
    current_order_count = len(current_orders)
    previous_order_count = len(previous_orders)

    total_customers = db.query(User).filter(User.role == UserRole.CUSTOMER).count()
    total_staff = db.query(Employee).count()
    total_services = db.query(Product).count()

    new_customers = (
        db.query(User)
        .filter(
            User.role == UserRole.CUSTOMER,
            User.id >= 1,
        )
        .order_by(User.id.desc())
        .limit(5)
        .all()
    )

    revenue_by_month_rows = (
        db.query(
            func.to_char(Order.created_at, "YYYY-MM").label("label"),
            func.coalesce(func.sum(Order.total), 0).label("value"),
        )
        .filter(Order.payment_status == PaymentStatus.PAID)
        .group_by("label")
        .order_by("label")
        .limit(12)
        .all()
    )

    revenue_by_day_rows = (
        db.query(
            func.to_char(Order.created_at, "YYYY-MM-DD").label("label"),
            func.coalesce(func.sum(Order.total), 0).label("value"),
        )
        .filter(
            Order.payment_status == PaymentStatus.PAID,
            Order.created_at >= start,
            Order.created_at <= end,
        )
        .group_by("label")
        .order_by("label")
        .all()
    )

    bookings_by_month_rows = (
        db.query(
            func.to_char(Order.created_at, "YYYY-MM").label("label"),
            func.count(Order.id).label("value"),
        )
        .filter(Order.created_at >= start - timedelta(days=365))
        .group_by("label")
        .order_by("label")
        .limit(12)
        .all()
    )

    top_services_rows = (
        db.query(
            Product.name,
            func.count(OrderItem.id).label("booking_count"),
            func.coalesce(func.sum(OrderItem.price * OrderItem.quantity), 0).label(
                "revenue"
            ),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.created_at >= start, Order.created_at <= end)
        .group_by(Product.id, Product.name)
        .order_by(func.count(OrderItem.id).desc())
        .limit(5)
        .all()
    )

    top_customers_rows = (
        db.query(
            Order.full_name,
            Order.email,
            func.count(Order.id).label("order_count"),
            func.coalesce(func.sum(Order.total), 0).label("total_spent"),
        )
        .filter(
            Order.created_at >= start,
            Order.created_at <= end,
            Order.payment_status == PaymentStatus.PAID,
        )
        .group_by(Order.full_name, Order.email)
        .order_by(func.count(Order.id).desc())
        .limit(5)
        .all()
    )

    recent_bookings = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(8)
        .all()
    )

    pending_bookings = (
        db.query(Order)
        .filter(Order.status == OrderStatus.PENDING)
        .order_by(Order.created_at.desc())
        .limit(8)
        .all()
    )

    return DashboardResponse(
        summary=DashboardSummary(
            total_revenue=current_revenue,
            total_orders=current_order_count,
            total_customers=total_customers,
            total_staff=total_staff,
            total_services=total_services,
            total_vouchers=0,
            total_reviews=0,
            revenue_trend_percent=_trend_percent(current_revenue, previous_revenue),
            orders_trend_percent=_trend_percent(current_order_count, previous_order_count),
        ),
        revenue_by_month=[
            DashboardChartPoint(label=row.label, value=int(row.value))
            for row in revenue_by_month_rows
        ],
        revenue_by_day=[
            DashboardChartPoint(label=row.label, value=int(row.value))
            for row in revenue_by_day_rows
        ],
        bookings_by_month=[
            DashboardChartPoint(label=row.label, value=int(row.value))
            for row in bookings_by_month_rows
        ],
        top_services=[
            DashboardServiceItem(
                name=row.name,
                booking_count=int(row.booking_count),
                revenue=int(row.revenue),
            )
            for row in top_services_rows
        ],
        top_customers=[
            DashboardCustomerItem(
                full_name=row.full_name,
                email=row.email,
                order_count=int(row.order_count),
                total_spent=int(row.total_spent),
            )
            for row in top_customers_rows
        ],
        recent_bookings=[_to_booking_item(order) for order in recent_bookings],
        new_customers=[
            DashboardCustomerItem(
                full_name=user.full_name,
                email=user.email,
                order_count=0,
                total_spent=0,
            )
            for user in new_customers
        ],
        pending_bookings=[_to_booking_item(order) for order in pending_bookings],
        filter_period=period,
        filter_start=start.isoformat(),
        filter_end=end.isoformat(),
    )
