"""
Products routes - CRUD operations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, asc, desc
from typing import Optional, List
import json
from datetime import datetime
from database import get_db, Product
from schemas import ProductCreate, ProductUpdate
from auth import require_admin
import os
import shutil
from fastapi import File, UploadFile
router = APIRouter()

# Public endpoints

@router.get("/api/products/feed")
async def get_products_feed(db: Session = Depends(get_db)):
    """
    Public product feed - returns all products with full information in JSON format
    """
    products = db.query(Product).filter(Product.in_stock == True).all()

    feed_data = {
        "meta": {
            "total": len(products),
            "generated_at": datetime.utcnow().isoformat(),
            "currency": "RUB",
            "brand": "Orient Watch"
        },
        "products": [
            {
                "id": product.id,
                "name": product.name,
                "collection": product.collection,
                "price": product.price,
                "currency": "RUB",
                "image": product.image,
                "images": json.loads(product.images) if product.images else [],
                "description": product.description,
                "features": json.loads(product.features) if product.features else [],
                "specs": json.loads(product.specs) if product.specs else {},
                "inStock": product.in_stock,
                "stockQuantity": product.stock_quantity,
                "sku": product.sku,
                "isFeatured": product.is_featured,
                "movement": product.movement,
                "caseMaterial": product.case_material,
                "dialColor": product.dial_color,
                "waterResistance": product.water_resistance,
                "seo": {
                    "title": product.seo_title,
                    "description": product.seo_description,
                    "keywords": product.seo_keywords
                },
                "social": {
                    "fbTitle": product.fb_title,
                    "fbDescription": product.fb_description
                },
                "url": f"/product/{product.id}",
                "createdAt": product.created_at.isoformat() if product.created_at else None,
                "updatedAt": product.updated_at.isoformat() if product.updated_at else None
            }
            for product in products
        ]
    }

    return feed_data


@router.get("/api/products")
async def get_products(
        page: int = Query(1, ge=1),
        limit: int = Query(20, ge=1, le=100),
        search: Optional[str] = None,
        collection: Optional[List[str]] = Query(None), # List для OR логики

        # Цены (Aliases обязательны!)
        min_price: Optional[float] = Query(None, alias="minPrice"),
        max_price: Optional[float] = Query(None, alias="maxPrice"),

        # Новые фильтры (Aliases обязательны!)
        brand: Optional[List[str]] = Query(None),
        gender: Optional[List[str]] = Query(None),
        min_diameter: Optional[float] = Query(None, alias="minDiameter"),
        max_diameter: Optional[float] = Query(None, alias="maxDiameter"),
        strap_material: Optional[List[str]] = Query(None, alias="strapMaterial"),

        # Существующие фильтры (Aliases обязательны, так как фронт шлет camelCase!)
        movement: Optional[List[str]] = Query(None),  # movement совпадает, alias не критичен, но лучше оставить
        case_material: Optional[List[str]] = Query(None, alias="caseMaterial"),
        dial_color: Optional[List[str]] = Query(None, alias="dialColor"),
        water_resistance: Optional[List[str]] = Query(None, alias="waterResistance"),

        features: Optional[List[str]] = Query(None),
        sort: str = Query('popular'),
        db: Session = Depends(get_db)
):
    """Get all products with filters"""
    query = db.query(Product)

    # --- Search ---
    if search:
        query = query.filter(or_(Product.name.contains(search), Product.sku.contains(search)))

    # --- Collection (OR Logic via IN) ---
    if collection:
        query = query.filter(Product.collection.in_(collection))

    # --- Price ---
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # --- New Filters (OR Logic via IN) ---
    if brand:
        query = query.filter(Product.brand.in_(brand))
    if gender:
        query = query.filter(Product.gender.in_(gender))

    # Диаметр (Range logic)
    if min_diameter is not None:
        query = query.filter(Product.case_diameter >= min_diameter)
    if max_diameter is not None:
        query = query.filter(Product.case_diameter <= max_diameter)

    if strap_material:
        query = query.filter(Product.strap_material.in_(strap_material))

    # --- Existing Filters (OR Logic via IN) ---
    if movement:
        query = query.filter(Product.movement.in_(movement))
    if case_material:
        query = query.filter(Product.case_material.in_(case_material))
    if dial_color:
        query = query.filter(Product.dial_color.in_(dial_color))
    if water_resistance:
        query = query.filter(Product.water_resistance.in_(water_resistance))

    # --- Features (OR Logic via OR_ + CONTAINS) ---
    if features:
        # Создаем список условий: (features LIKE '%f1%') OR (features LIKE '%f2%') ...
        conditions = [Product.features.contains(feature) for feature in features]
        query = query.filter(or_(*conditions))

    # --- Sorting ---
    if sort == 'price-asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price-desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'newest':
        query = query.order_by(Product.created_at.desc())
    elif sort == 'name':
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.is_featured.desc(), Product.created_at.desc())

    # --- Pagination ---
    total = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

    return {
        "data": [product.to_dict() for product in products],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }


@router.get("/api/products/filters")
async def get_available_filters(db: Session = Depends(get_db)):
    """Get available filter options"""

    def get_options(column):
        results = db.query(column, func.count(Product.id)) \
            .filter(column.isnot(None)) \
            .group_by(column) \
            .all()
        # Сортируем по алфавиту для удобства
        opts = [{"label": str(r[0]), "value": str(r[0]), "count": r[1]} for r in results if r[0]]
        return sorted(opts, key=lambda x: x['label'])

    return {
        "brands": get_options(Product.brand),
        "genders": get_options(Product.gender),
        "strapMaterials": get_options(Product.strap_material),
        "movements": get_options(Product.movement),
        "caseMaterials": get_options(Product.case_material),
        "dialColors": get_options(Product.dial_color),
        "waterResistances": get_options(Product.water_resistance)
    }

# <--- НОВЫЙ ЭНДПОИНТ ДЛЯ АДМИНКИ (ПОЛУЧЕНИЕ ВСЕХ ОСОБЕННОСТЕЙ) --->
@router.get("/api/products/features/unique")
async def get_unique_features(db: Session = Depends(get_db)):
    """Get all unique features from all products (for admin setup)"""
    products = db.query(Product.features).all()

    unique_set = set()
    for p in products:
        if p.features:
            try:
                # Пытаемся распарсить JSON
                feats = json.loads(p.features)
                if isinstance(feats, list):
                    for f in feats:
                        unique_set.add(f.strip())
            except:
                pass

    return sorted(list(unique_set))

@router.get("/api/products/{product_id}")
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get product by ID (public)"""
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product.to_dict()

# Admin endpoints
@router.post("/api/admin/products/bulk-image")
async def upload_product_bulk_image(
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """
    Bulk upload handler.
    Parses SKU-Index from filename (e.g. "RE-BT0006L00B-1.jpg").
    Finds product by SKU.
    Updates image at specific index (1 = main, 2+ = gallery).
    """
    filename = file.filename

    # 1. Парсинг имени файла
    # Ожидаем формат: SKU-Index.ext
    try:
        name_without_ext = filename.rsplit('.', 1)[0]
        # Разделяем по последнему дефису
        if '-' not in name_without_ext:
            raise ValueError("No separator found")

        sku_part, index_part = name_without_ext.rsplit('-', 1)
        sku = sku_part.strip()
        img_index = int(index_part)
    except Exception:
        # Если формат неверный, возвращаем ошибку, но с кодом 400
        # Чтобы клиент понял, что файл пропущен
        raise HTTPException(status_code=400, detail=f"Неверный формат имени файла: {filename}. Ожидается SKU-Номер.ext")

    # 2. Поиск товара
    product = db.query(Product).filter(Product.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с SKU '{sku}' не найден")

    # 3. Сохранение файла (Логика аналогична upload.py)
    # Создаем папку uploads если нет
    UPLOAD_DIR = "uploads"
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # Генерируем уникальное имя, чтобы избежать кэширования при замене
    import uuid
    file_ext = filename.split('.')[-1]
    save_filename = f"{sku}-{img_index}-{str(uuid.uuid4())[:8]}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, save_filename)

    with open(file_path, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{save_filename}"

    # 4. Обновление товара
    # Логика: 1 -> Главное фото, >1 -> Галерея

    if img_index == 1:
        # Главное изображение
        product.image = image_url
    else:
        # Галерея
        gallery_idx = img_index - 2  # 2 -> 0, 3 -> 1 ...

        current_images = []
        if product.images:
            try:
                current_images = json.loads(product.images)
            except:
                current_images = []

        # Если индекс выходит за пределы, просто добавляем (или расширяем массив)
        if gallery_idx < len(current_images):
            current_images[gallery_idx] = image_url
        else:
            # Если нужно вставить на 5-е место, а всего 1 фото, просто добавляем в конец
            current_images.append(image_url)

        product.images = json.dumps(current_images)

    db.commit()

    return {"status": "success", "sku": sku, "index": img_index, "url": image_url}

@router.get("/api/admin/products")
async def get_all_products_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    collection: Optional[str] = None,
    brand: Optional[str] = None,  # <--- ДОБАВЛЕНО
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all products with filters (admin)"""
    query = db.query(Product)

    if search:
        query = query.filter(
            or_(
                Product.name.contains(search),
                Product.sku.contains(search)
            )
        )

    if collection:
        query = query.filter(Product.collection == collection)

    # <--- ДОБАВЛЕНО: Фильтрация по бренду
    if brand:
        query = query.filter(Product.brand == brand)

    # Сортировка по дате создания (новые сверху)
    query = query.order_by(Product.created_at.desc())

    total = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

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
    if product.sku:
        existing = db.query(Product).filter(Product.sku == product.sku).first()
        if existing:
            raise HTTPException(status_code=409, detail="SKU already exists")

    product_id = product.name.lower().replace(" ", "-").replace("&", "and")
    existing_id = db.query(Product).filter(Product.id == product_id).first()
    if existing_id:
        import uuid
        product_id = f"{product_id}-{str(uuid.uuid4())[:8]}"

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
        # Новые поля
        brand=product.brand,
        gender=product.gender,
        case_diameter=product.caseDiameter,
        strap_material=product.strapMaterial,
        # Существующие поля
        movement=product.movement,
        case_material=product.caseMaterial,
        dial_color=product.dialColor,
        water_resistance=product.waterResistance,
        # SEO & FB
        seo_title=product.seoTitle,
        seo_description=product.seoDescription,
        seo_keywords=product.seoKeywords,
        fb_title=product.fbTitle,
        fb_description=product.fbDescription,
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
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.dict(exclude_unset=True)

    for key, value in update_data.items():
        # Special mappings
        if key in ["images", "features", "specs"] and value is not None:
            setattr(db_product, key, json.dumps(value))
        # CamelCase to snake_case mappings
        elif key == "inStock": setattr(db_product, "in_stock", value)
        elif key == "stockQuantity": setattr(db_product, "stock_quantity", value)
        # New filters
        elif key == "caseDiameter": setattr(db_product, "case_diameter", value)
        elif key == "strapMaterial": setattr(db_product, "strap_material", value)
        # Existing filters
        elif key == "caseMaterial": setattr(db_product, "case_material", value)
        elif key == "dialColor": setattr(db_product, "dial_color", value)
        elif key == "waterResistance": setattr(db_product, "water_resistance", value)
        # SEO & FB
        elif key == "seoTitle": setattr(db_product, "seo_title", value)
        elif key == "seoDescription": setattr(db_product, "seo_description", value)
        elif key == "seoKeywords": setattr(db_product, "seo_keywords", value)
        elif key == "fbTitle": setattr(db_product, "fb_title", value)
        elif key == "fbDescription": setattr(db_product, "fb_description", value)
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