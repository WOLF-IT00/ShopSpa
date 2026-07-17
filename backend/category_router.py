from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Category, User
from schemas import CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name).all()
    return categories


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(
    name: str,
    slug: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    category = Category(name=name, slug=slug)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
