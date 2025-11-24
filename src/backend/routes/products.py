"""
Products routes - CRUD operations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import json

from database import get_db, Product, FilterOption
from schemas import ProductCreate, ProductUpdate
from auth import require_admin

router = APIRouter()

# Public endpoints
@router.get("/api/products")
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    collection: Optional[str] = None,
    min_price: Optional[float] = Query(None, alias="minPrice"),
    max_price: Optional[float] = Query(None, alias="maxPrice"),
    movement: Optional[str] = None,
    case_material: Optional[str] = Query(None, alias="caseMaterial"),
    dial_color: Optional[str] = Query(None, alias="dialColor"),
    water_resistance: Optional[str] = Query(None, alias="waterResistance"),
    db: Session = Depends(get_db)
):
    """Get all products with filters and pagination (public)"""
    query = db.query(Product)
    
    # Filters
    if search:
        query = query.filter(Product.name.contains(search))
    
    if collection:
        query = query.filter(Product.collection == collection)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if movement:
        query = query.filter(Product.movement == movement)
    
    if case_material:
        query = query.filter(Product.case_material == case_material)
    
    if dial_color:
        query = query.filter(Product.dial_color == dial_color)
    
    if water_resistance:
        query = query.filter(Product.water_resistance == water_resistance)
    
    # Count total
    total = query.count()
    
    # Pagination
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    # Convert to dict
    data = [product.to_dict() for product in products]
    
    return {
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

@router.get("/api/products/filters")
async def get_available_filters(db: Session = Depends(get_db)):
    """Get available filter options based on existing products"""
    # Get unique values from products
    movements = db.query(Product.movement).filter(Product.movement.isnot(None)).distinct().all()
    materials = db.query(Product.case_material).filter(Product.case_material.isnot(None)).distinct().all()
    colors = db.query(Product.dial_color).filter(Product.dial_color.isnot(None)).distinct().all()
    water_res = db.query(Product.water_resistance).filter(Product.water_resistance.isnot(None)).distinct().all()
    
    # Count products for each filter
    def count_products(field, value):
        return db.query(func.count(Product.id)).filter(field == value).scalar()
    
    return {
        "movements": [
            {
                "label": m[0].replace("_", " ").title(),
                "value": m[0],
                "count": count_products(Product.movement, m[0])
            }
            for m in movements if m[0]
        ],
        "caseMaterials": [
            {
                "label": m[0].replace("_", " ").title(),
                "value": m[0],
                "count": count_products(Product.case_material, m[0])
            }
            for m in materials if m[0]
        ],
        "dialColors": [
            {
                "label": c[0].replace("_", " ").title(),
                "value": c[0],
                "count": count_products(Product.dial_color, c[0])
            }
            for c in colors if c[0]
        ],
        "waterResistance": [
            {
                "label": w[0],
                "value": w[0],
                "count": count_products(Product.water_resistance, w[0])
            }
            for w in water_res if w[0]
        ]
    }

@router.get("/api/products/{product_id}")
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get product by ID (public)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product.to_dict()

# Admin endpoints
@router.get("/api/admin/products")
async def get_all_products_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    collection: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all products with filters (admin)"""
    query = db.query(Product)
    
    # Filters
    if search:
        query = query.filter(Product.name.contains(search))
    
    if collection:
        query = query.filter(Product.collection == collection)
    
    # Count total
    total = query.count()
    
    # Pagination
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    # Convert to dict
    data = [product.to_dict() for product in products]
    
    return {
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

@router.get("/api/admin/products/{product_id}")
async def get_product_admin(
    product_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get product by ID (admin)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product.to_dict()

@router.post("/api/admin/products")
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Create new product (admin)"""
    # Check if SKU exists
    if product.sku:
        existing = db.query(Product).filter(Product.sku == product.sku).first()
        if existing:
            raise HTTPException(status_code=409, detail="SKU already exists")
    
    # Generate ID from name
    product_id = product.name.lower().replace(" ", "-").replace("&", "and")
    
    # Check if ID exists
    existing_id = db.query(Product).filter(Product.id == product_id).first()
    if existing_id:
        # Add random suffix
        import uuid
        product_id = f"{product_id}-{str(uuid.uuid4())[:8]}"
    
    # Create product
    db_product = Product(
        id=product_id,
        name=product.name,
        collection=product.collection,
        price=product.price,
        image=product.image,
        images=json.dumps(product.images),
        description=product.description,
        features=json.dumps(product.features),
        specs=json.dumps(product.specs),
        in_stock=product.inStock,
        stock_quantity=product.stockQuantity,
        sku=product.sku,
        movement=getattr(product, 'movement', None),
        case_material=getattr(product, 'caseMaterial', None),
        dial_color=getattr(product, 'dialColor', None),
        water_resistance=getattr(product, 'waterResistance', None),
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product.to_dict()

@router.put("/api/admin/products/{product_id}")
async def update_product(
    product_id: str,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update product (admin)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    update_data = product.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "images" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "features" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "specs" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "inStock":
            setattr(db_product, "in_stock", value)
        elif key == "stockQuantity":
            setattr(db_product, "stock_quantity", value)
        elif key == "caseMaterial":
            setattr(db_product, "case_material", value)
        elif key == "dialColor":
            setattr(db_product, "dial_color", value)
        elif key == "waterResistance":
            setattr(db_product, "water_resistance", value)
        else:
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    
    return db_product.to_dict()

@router.delete("/api/admin/products/{product_id}")
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Delete product (admin)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    
    return {"message": "Product deleted", "id": product_id}