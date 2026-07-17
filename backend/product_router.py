import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user, require_admin
from database import get_db
from models import Category, Product, User
from schemas import (
    CategoryResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["products"])


def _slugify(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    return slug


def _get_or_create_category(db: Session, category_name: str) -> Category:
    category = db.query(Category).filter(Category.name == category_name).first()
    if category:
        return category

    category = Category(name=category_name, slug=_slugify(category_name))
    db.add(category)
    db.flush()
    return category


def _to_response(product: Product) -> ProductResponse:
    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        price=product.price,
        category=product.category_rel.name if product.category_rel else "",
        duration=product.duration,
        imageUrl=product.image_url,
        description=product.description,
        gallery=product.gallery or [],
        benefits=product.benefits or [],
        healthInfo=product.health_info,
        steps=product.steps or [],
    )


def _apply_payload(product: Product, payload: dict, db: Session) -> None:
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
            value = [step.model_dump() for step in value]
        attr = field_map.get(key, key)
        setattr(product, attr, value)


@router.get("", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = (
        db.query(Product).order_by(Product.id).all()
    )
    return [_to_response(product) for product in products]


@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return _to_response(product)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return _to_response(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    existing = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product slug already exists",
        )

    product = Product()
    _apply_payload(product, product_in.model_dump(), db)
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    update_data = product_in.model_dump(exclude_unset=True)
    if "slug" in update_data:
        existing = (
            db.query(Product)
            .filter(Product.slug == update_data["slug"], Product.id != product_id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product slug already exists",
            )

    _apply_payload(product, update_data, db)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()
