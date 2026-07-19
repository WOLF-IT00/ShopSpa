from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Employee, Order, PaymentStatus, Product, User, UserRole
from schemas import (
    AdminPaymentResponse,
    AdminStatsResponse,
    AdminUserUpdate,
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    UserResponse,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _pages(total: int, size: int) -> int:
    return max(1, ceil(total / size)) if size else 1


@router.get("/stats", response_model=AdminStatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_bookings = db.query(Order).count()
    paid_orders = (
        db.query(Order).filter(Order.payment_status == PaymentStatus.PAID).all()
    )
    total_revenue = sum(order.total for order in paid_orders)

    return AdminStatsResponse(
        total_users=total_users,
        total_products=total_products,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
    )


@router.get("/users")
def list_users(
    q: str = "",
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = db.query(User)
    if q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            (User.full_name.ilike(term)) | (User.email.ilike(term))
        )

    total = query.count()
    users = (
        query.order_by(User.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "items": [
            UserResponse(
                id=u.id,
                email=u.email,
                full_name=u.full_name,
                role=u.role.value,
                is_active=getattr(u, "is_active", True),
            )
            for u in users
        ],
        "meta": {
            "total": total,
            "page": page,
            "size": size,
            "pages": _pages(total, size),
        },
    }


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id and payload.is_active is False:
        raise HTTPException(status_code=400, detail="Cannot lock your own account")

    if user.id == admin.id and payload.role and payload.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=400, detail="Cannot demote your own account")

    if payload.role is not None:
        if payload.role not in {UserRole.ADMIN.value, UserRole.CUSTOMER.value}:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = UserRole(payload.role)

    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
        is_active=user.is_active,
    )


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()


@router.get("/employees")
def list_employees(
    q: str = "",
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(Employee)
    if q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            (Employee.full_name.ilike(term))
            | (Employee.email.ilike(term))
            | (Employee.position.ilike(term))
        )

    total = query.count()
    employees = (
        query.order_by(Employee.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "items": [EmployeeResponse.model_validate(e) for e in employees],
        "meta": {
            "total": total,
            "page": page,
            "size": size,
            "pages": _pages(total, size),
        },
    }


@router.post("/employees", response_model=EmployeeResponse, status_code=201)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return EmployeeResponse.model_validate(employee)


@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return EmployeeResponse.model_validate(employee)


@router.delete("/employees/{employee_id}", status_code=204)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()


@router.get("/payments")
def list_payments(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(Order).filter(Order.payment_status == PaymentStatus.PAID)
    total = query.count()
    orders = (
        query.order_by(Order.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    items = [
        AdminPaymentResponse(
            order_id=order.id,
            full_name=order.full_name,
            email=order.email,
            total=order.total,
            payment_status=order.payment_status.value,
            payment_method=order.payment_method,
            booking_date=order.booking_date,
            booking_time=order.booking_time,
            created_at=order.created_at,
        )
        for order in orders
    ]

    return {
        "items": items,
        "meta": {
            "total": total,
            "page": page,
            "size": size,
            "pages": _pages(total, size),
        },
    }
