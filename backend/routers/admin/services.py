import uuid
from math import ceil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Category, OrderItem, Product, User
from product_router import _slugify, _to_response
from schemas import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/admin/services", tags=["admin-services"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
DEFAULT_IMAGE = "/uploads/placeholder.jpg"


def _pages(total: int, size: int) -> int:
    return max(1, ceil(total / size)) if size else 1


def _get_or_create_category(db: Session, category_name: str) -> Category:
    name = category_name.strip()
    category = db.query(Category).filter(Category.name == name).first()
    if category:
        return category

    category = Category(name=name, slug=_slugify(name))
    db.add(category)
    db.flush()
    return category


def _apply_service_payload(product: Product, payload: dict, db: Session) -> None:
    field_map = {
        "imageUrl": "image_url",
        "healthInfo": "health_info",
    }

    for key, value in payload.items():
        if value is None:
            continue
        if key == "category":
            product.category_id = _get_or_create_category(db, value).id
            continue
        if key == "steps":
            value = [
                step if isinstance(step, dict) else step.model_dump()
                for step in value
            ]
        attr = field_map.get(key, key)
        setattr(product, attr, value)


def _normalize_create(payload: ProductCreate) -> dict:
    data = payload.model_dump()
    name = data["name"].strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    if data["price"] <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")
    if not data["category"].strip():
        raise HTTPException(status_code=400, detail="Category is required")

    data["name"] = name
    data["category"] = data["category"].strip()
    data["slug"] = data["slug"].strip() or _slugify(name)
    data["duration"] = data["duration"].strip() or "60 phút"
    data["imageUrl"] = data["imageUrl"].strip() or DEFAULT_IMAGE
    data["description"] = data["description"].strip()
    data["healthInfo"] = data["healthInfo"].strip()
    data["gallery"] = [url.strip() for url in data.get("gallery", []) if url.strip()]
    data["benefits"] = [b.strip() for b in data.get("benefits", []) if b.strip()]
    return data


def _validate_update(update_data: dict) -> None:
    if "name" in update_data and update_data["name"] is not None:
        if not update_data["name"].strip():
            raise HTTPException(status_code=400, detail="Name is required")
        update_data["name"] = update_data["name"].strip()

    if "price" in update_data and update_data["price"] is not None:
        if update_data["price"] <= 0:
            raise HTTPException(status_code=400, detail="Price must be greater than 0")

    if "category" in update_data and update_data["category"] is not None:
        if not update_data["category"].strip():
            raise HTTPException(status_code=400, detail="Category is required")
        update_data["category"] = update_data["category"].strip()

    if "gallery" in update_data and update_data["gallery"] is not None:
        update_data["gallery"] = [
            url.strip() for url in update_data["gallery"] if url.strip()
        ]

    if "benefits" in update_data and update_data["benefits"] is not None:
        update_data["benefits"] = [
            b.strip() for b in update_data["benefits"] if b.strip()
        ]


@router.get("")
def list_services(
    q: str = "",
    category: str = Query("", alias="category"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(Product)

    if q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            (Product.name.ilike(term)) | (Product.slug.ilike(term))
        )

    if category.strip():
        query = query.join(Category).filter(Category.name == category.strip())

    total = query.count()
    products = (
        query.order_by(Product.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "items": [_to_response(product) for product in products],
        "meta": {
            "total": total,
            "page": page,
            "size": size,
            "pages": _pages(total, size),
        },
    }


@router.get("/{service_id}", response_model=ProductResponse)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == service_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Service not found")
    return _to_response(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    data = _normalize_create(payload)

    existing = db.query(Product).filter(Product.slug == data["slug"]).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service slug already exists")

    product = Product()
    _apply_service_payload(product, data, db)
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.put("/{service_id}", response_model=ProductResponse)
def update_service(
    service_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == service_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = payload.model_dump(exclude_unset=True)
    _validate_update(update_data)

    if "slug" in update_data and update_data["slug"]:
        update_data["slug"] = update_data["slug"].strip()
        existing = (
            db.query(Product)
            .filter(Product.slug == update_data["slug"], Product.id != service_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Service slug already exists")

    _apply_service_payload(product, update_data, db)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == service_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Service not found")

    has_orders = (
        db.query(OrderItem).filter(OrderItem.product_id == service_id).first()
        is not None
    )
    if has_orders:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete service that has existing orders",
        )

    db.delete(product)
    db.commit()


@router.post("/upload")
async def upload_service_image(
    file: UploadFile = File(...),
    _: User = Depends(require_admin),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / filename

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    filepath.write_bytes(content)
    return {"url": f"/uploads/{filename}"}
