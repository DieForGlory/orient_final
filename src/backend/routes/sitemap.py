# src/backend/routes/sitemap.py

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from database import get_db, Product, Collection
from datetime import datetime

router = APIRouter()
BASE_URL = "https://orientwatch.uz"


@router.get("/sitemap.xml")
async def get_sitemap(db: Session = Depends(get_db)):
    urls = []

    # 1. Статические страницы
    static_pages = [
        "/", "/catalog", "/boutique", "/history",
        "/collections", "/warranty", "/delivery_policy", "/return_policy"
    ]

    for path in static_pages:
        urls.append(f"""
    <url>
        <loc>{BASE_URL}{path}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>""")

    # 2. Товары
    products = db.query(Product).filter(Product.in_stock == True).all()
    for p in products:
        lastmod = p.updated_at.strftime("%Y-%m-%d") if p.updated_at else datetime.now().strftime("%Y-%m-%d")
        urls.append(f"""
    <url>
        <loc>{BASE_URL}/product/{p.id}</loc>
        <lastmod>{lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>""")

    # 3. Коллекции
    collections = db.query(Collection).filter(Collection.active == True).all()
    for c in collections:
        urls.append(f"""
    <url>
        <loc>{BASE_URL}/collection/{c.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>""")

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(urls)}
</urlset>"""

    return Response(content=xml_content, media_type="application/xml")