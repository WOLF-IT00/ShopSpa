import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

from database import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    PAID = "PAID"


class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)

    products = relationship("Product", back_populates="category_rel")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    price = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    duration = Column(String(100), nullable=False)
    image_url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    gallery = Column(JSON, nullable=False, default=list)
    benefits = Column(JSON, nullable=False, default=list)
    health_info = Column(Text, nullable=False)
    steps = Column(JSON, nullable=False, default=list)

    category_rel = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    is_active = Column(Boolean, nullable=False, default=True)

    orders = relationship("Order", back_populates="user")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    position = Column(String(100), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    total = Column(Integer, nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    payment_status = Column(
        Enum(PaymentStatus), nullable=False, default=PaymentStatus.UNPAID
    )
    payment_method = Column(String(50), nullable=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    booking_date = Column(String(20), nullable=False)
    booking_time = Column(String(20), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )
    status_logs = relationship(
        "OrderStatusLog", back_populates="order", cascade="all, delete-orphan"
    )


class OrderStatusLog(Base):
    __tablename__ = "order_status_logs"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    action = Column(String(50), nullable=False)
    old_value = Column(String(50), nullable=True)
    new_value = Column(String(50), nullable=False)
    note = Column(Text, nullable=True)
    created_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    order = relationship("Order", back_populates="status_logs")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
