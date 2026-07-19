import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", "8000"))


def get_cors_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS", "").strip()
    if origins:
        return [origin.strip() for origin in origins.split(",") if origin.strip()]

    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url:
        return [frontend_url.rstrip("/")]

    return []


def get_frontend_url() -> str:
    url = os.getenv("FRONTEND_URL", "").strip()
    if not url:
        raise ValueError("FRONTEND_URL environment variable is required")
    return url.rstrip("/")


def get_paypal_return_url() -> str:
    url = os.getenv("PAYPAL_RETURN_URL", "").strip()
    if url:
        return url
    return f"{get_frontend_url()}/payment/paypal/success"


def get_paypal_cancel_url() -> str:
    url = os.getenv("PAYPAL_CANCEL_URL", "").strip()
    if url:
        return url
    return f"{get_frontend_url()}/payment/paypal/cancel"
