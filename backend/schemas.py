from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TreatmentStep(BaseModel):
    title: str
    description: str


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str
    slug: str
    price: int
    category: str
    duration: str
    imageUrl: str
    description: str
    gallery: list[str] = Field(default_factory=list)
    benefits: list[str] = Field(default_factory=list)
    healthInfo: str
    steps: list[TreatmentStep] = Field(default_factory=list)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    price: int | None = None
    category: str | None = None
    duration: str | None = None
    imageUrl: str | None = None
    description: str | None = None
    gallery: list[str] | None = None
    benefits: list[str] | None = None
    healthInfo: str | None = None
    steps: list[TreatmentStep] | None = None


class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    full_name: str
    phone: str
    email: EmailStr
    booking_date: str
    booking_time: str
    note: str | None = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: int


class OrderResponse(BaseModel):
    id: int
    total: int
    status: str
    payment_status: str
    payment_method: str | None
    full_name: str
    phone: str
    email: str
    booking_date: str
    booking_time: str
    note: str | None
    created_at: datetime
    items: list[OrderItemResponse]


class PaymentCreate(BaseModel):
    order_id: int
    method: str


class PaymentResponse(BaseModel):
    order_id: int
    payment_status: str
    message: str


class PayPalCreateOrder(BaseModel):
    order_id: int


class PayPalCreateOrderResponse(BaseModel):
    approve_url: str


class PayPalCaptureOrder(BaseModel):
    order_id: int
    paypal_order_id: str


class PaymentConfirm(BaseModel):
    order_id: int
    provider: str
    paypal_order_id: str | None = None


class AdminStatsResponse(BaseModel):
    total_users: int
    total_products: int
    total_bookings: int
    total_revenue: int


class DashboardSummary(BaseModel):
    total_revenue: int
    total_orders: int
    total_customers: int
    total_staff: int
    total_services: int
    total_vouchers: int
    total_reviews: int
    revenue_trend_percent: float
    orders_trend_percent: float


class DashboardChartPoint(BaseModel):
    label: str
    value: int


class DashboardServiceItem(BaseModel):
    name: str
    booking_count: int
    revenue: int


class DashboardCustomerItem(BaseModel):
    full_name: str
    email: str
    order_count: int
    total_spent: int


class DashboardBookingItem(BaseModel):
    id: int
    full_name: str
    email: str
    total: int
    status: str
    payment_status: str
    booking_date: str
    booking_time: str
    created_at: datetime


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    revenue_by_month: list[DashboardChartPoint]
    revenue_by_day: list[DashboardChartPoint]
    bookings_by_month: list[DashboardChartPoint]
    top_services: list[DashboardServiceItem]
    top_customers: list[DashboardCustomerItem]
    recent_bookings: list[DashboardBookingItem]
    new_customers: list[DashboardCustomerItem]
    pending_bookings: list[DashboardBookingItem]
    filter_period: str
    filter_start: str
    filter_end: str


class AdminUserUpdate(BaseModel):
    role: str | None = None
    is_active: bool | None = None


class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    position: str
    is_active: bool = True


class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    position: str | None = None
    is_active: bool | None = None


class EmployeeResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    position: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: str


class PaymentStatusUpdate(BaseModel):
    payment_status: str


class OrderStatusLogResponse(BaseModel):
    id: int
    order_id: int
    action: str
    old_value: str | None
    new_value: str
    note: str | None
    created_by: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderDetailResponse(OrderResponse):
    status_logs: list[OrderStatusLogResponse] = Field(default_factory=list)


class AdminPaymentResponse(BaseModel):
    order_id: int
    full_name: str
    email: str
    total: int
    payment_status: str
    payment_method: str | None
    booking_date: str
    booking_time: str
    created_at: datetime


class PaginatedMeta(BaseModel):
    total: int
    page: int
    size: int
    pages: int
