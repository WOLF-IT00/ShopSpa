import os
from decimal import Decimal, ROUND_HALF_UP

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config import get_paypal_cancel_url, get_paypal_return_url
from database import get_db
from models import Order, OrderStatus, PaymentStatus
from schemas import (
    PaymentConfirm,
    PaymentCreate,
    PaymentResponse,
    PayPalCaptureOrder,
    PayPalCreateOrder,
    PayPalCreateOrderResponse,
)

router = APIRouter(prefix="/payments", tags=["payments"])

PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"
VND_TO_USD_RATE = Decimal("25000")


def _paypal_credentials() -> tuple[str, str]:
    client_id = os.getenv("PAYPAL_CLIENT_ID", "").strip()
    client_secret = os.getenv("PAYPAL_CLIENT_SECRET", "").strip()
    if not client_id or not client_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="PayPal credentials are not configured",
        )
    return client_id, client_secret


def _get_paypal_access_token() -> str:
    client_id, client_secret = _paypal_credentials()
    response = httpx.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        data={"grant_type": "client_credentials"},
        auth=(client_id, client_secret),
        headers={"Accept": "application/json"},
        timeout=30.0,
    )
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to authenticate with PayPal",
        )
    return response.json()["access_token"]


def _vnd_to_usd(amount_vnd: int) -> str:
    usd = (Decimal(amount_vnd) / VND_TO_USD_RATE).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    if usd < Decimal("0.01"):
        usd = Decimal("0.01")
    return f"{usd:.2f}"


def _capture_paypal_order(paypal_order_id: str) -> dict:
    """Capture an approved PayPal Checkout order so the charge is finalized."""
    access_token = _get_paypal_access_token()
    response = httpx.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders/{paypal_order_id}/capture",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        timeout=30.0,
    )

    data = response.json() if response.content else {}

    # Idempotent: already captured is OK (e.g. double success-page load)
    if response.status_code == 422:
        issue = ""
        details = data.get("details") or []
        if details:
            issue = details[0].get("issue", "")
        if issue == "ORDER_ALREADY_CAPTURED":
            return {"status": "COMPLETED", "id": paypal_order_id}

    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to capture PayPal order: {response.text}",
        )

    if data.get("status") != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"PayPal capture not completed (status={data.get('status')})",
        )

    return data


def _mark_order_paypal_paid(order: Order, db: Session) -> PaymentResponse:
    order.payment_method = "paypal"
    order.payment_status = PaymentStatus.PAID
    order.status = OrderStatus.PAID
    db.commit()
    return PaymentResponse(
        order_id=order.id,
        payment_status=order.payment_status.value,
        message="PayPal payment captured",
    )


@router.post("", response_model=PaymentResponse)
def process_payment(payment_in: PaymentCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == payment_in.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if order.payment_status == PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid",
        )

    if payment_in.method not in {"bank", "momo"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment method",
        )

    order.payment_method = payment_in.method
    order.payment_status = PaymentStatus.PAID
    order.status = OrderStatus.PAID
    db.commit()

    return PaymentResponse(
        order_id=order.id,
        payment_status=order.payment_status.value,
        message="Payment processed successfully",
    )


@router.post("/paypal/create-order", response_model=PayPalCreateOrderResponse)
def create_paypal_order(
    payload: PayPalCreateOrder,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if order.status == OrderStatus.PAID or order.payment_status == PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid",
        )

    try:
        return_url = get_paypal_return_url()
        cancel_url = get_paypal_cancel_url()
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    access_token = _get_paypal_access_token()
    usd_amount = _vnd_to_usd(order.total)

    paypal_payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": str(order.id),
                "custom_id": str(order.id),
                "amount": {
                    "currency_code": "USD",
                    "value": usd_amount,
                },
                "description": f"ShopHub Order #{order.id}",
            }
        ],
        "application_context": {
            "brand_name": "ShopHub",
            "landing_page": "LOGIN",
            "user_action": "PAY_NOW",
            "return_url": f"{return_url}?order_id={order.id}",
            "cancel_url": f"{cancel_url}?order_id={order.id}",
        },
    }

    response = httpx.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders",
        json=paypal_payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        timeout=30.0,
    )

    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to create PayPal order: {response.text}",
        )

    data = response.json()
    approve_link = next(
        (link.get("href") for link in data.get("links", []) if link.get("rel") == "approve"),
        None,
    )
    if not approve_link:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="PayPal approve link not found",
        )

    order.payment_method = "paypal"
    db.commit()

    return PayPalCreateOrderResponse(approve_url=approve_link)


@router.post("/paypal/capture", response_model=PaymentResponse)
def capture_paypal_order(
    payload: PayPalCaptureOrder,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if order.status == OrderStatus.PAID or order.payment_status == PaymentStatus.PAID:
        return PaymentResponse(
            order_id=order.id,
            payment_status=order.payment_status.value,
            message="Order already paid",
        )

    paypal_order_id = payload.paypal_order_id.strip()
    if not paypal_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="paypal_order_id is required",
        )

    _capture_paypal_order(paypal_order_id)
    return _mark_order_paypal_paid(order, db)


@router.post("/confirm", response_model=PaymentResponse)
def confirm_payment(payload: PaymentConfirm, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if order.status == OrderStatus.PAID or order.payment_status == PaymentStatus.PAID:
        return PaymentResponse(
            order_id=order.id,
            payment_status=order.payment_status.value,
            message="Order already paid",
        )

    if payload.provider != "paypal":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported payment provider",
        )

    paypal_order_id = (payload.paypal_order_id or "").strip()
    if not paypal_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="paypal_order_id (PayPal token) is required to capture payment",
        )

    _capture_paypal_order(paypal_order_id)
    return _mark_order_paypal_paid(order, db)
