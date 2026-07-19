import json
import re
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from config import get_cors_origins
from admin_router import router as admin_router
from auth import hash_password
from auth_router import router as auth_router
from category_router import router as category_router
from database import Base, SessionLocal, engine
from models import Category, Product, User, UserRole
from order_router import router as order_router
from payment_router import router as payment_router
from product_router import router as product_router
from routers.admin.dashboard import router as admin_dashboard_router
from routers.admin.orders import router as admin_orders_router
from routers.admin.services import router as admin_services_router

SEED_PATHS = [
    Path(__file__).resolve().parent.parent
    / "frontend"
    / "src"
    / "data"
    / "products.json",
    Path(__file__).resolve().parent / "seed" / "products.json",
]


def get_seed_file() -> Path:
    for path in SEED_PATHS:
        if path.exists():
            return path
    raise FileNotFoundError("products.json seed file not found")


def _slugify(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    return slug


def seed_categories(db: Session, products_data: list) -> dict[str, Category]:
    category_map: dict[str, Category] = {}
    unique_names = sorted({item["category"] for item in products_data})

    for name in unique_names:
        category = db.query(Category).filter(Category.name == name).first()
        if not category:
            category = Category(name=name, slug=_slugify(name))
            db.add(category)
            db.flush()
        category_map[name] = category

    db.commit()
    return category_map


def seed_products(db: Session, products_data: list, category_map: dict[str, Category]) -> None:
    for item in products_data:
        product = Product(
            id=item["id"],
            name=item["name"],
            slug=item["slug"],
            price=item["price"],
            category_id=category_map[item["category"]].id,
            duration=item["duration"],
            image_url=item["imageUrl"],
            description=item["description"],
            gallery=item.get("gallery", []),
            benefits=item.get("benefits", []),
            health_info=item["healthInfo"],
            steps=item.get("steps", []),
        )
        db.add(product)

    db.commit()
    db.execute(
        text(
            "SELECT setval(pg_get_serial_sequence('products', 'id'), "
            "(SELECT COALESCE(MAX(id), 1) FROM products))"
        )
    )
    db.commit()


def seed_admin(db: Session) -> None:
    admin_email = "admin@shophub.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if admin:
        return

    admin = User(
        email=admin_email,
        password_hash=hash_password("admin123"),
        full_name="ShopHub Admin",
        role=UserRole.ADMIN,
    )
    db.add(admin)
    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        db.execute(
            text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active "
                "BOOLEAN NOT NULL DEFAULT TRUE"
            )
        )
        db.commit()

        with get_seed_file().open(encoding="utf-8") as file:
            products_data = json.load(file)

        if db.query(Category).count() == 0:
            category_map = seed_categories(db, products_data)
        else:
            category_map = {
                category.name: category
                for category in db.query(Category).all()
            }

        if db.query(Product).count() == 0:
            seed_products(db, products_data, category_map)

        seed_admin(db)
    finally:
        db.close()

    yield


app = FastAPI(title="ShopHub API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(category_router)
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(payment_router)
app.include_router(admin_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_services_router)
app.include_router(admin_orders_router)

uploads_dir = Path(__file__).resolve().parent / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/")
def root():
    return {"message": "ShopHub API is running"}
