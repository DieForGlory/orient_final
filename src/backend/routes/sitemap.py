from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from database import get_db, Product, Collection
from datetime import datetime

router = APIRouter()

# Укажите ваш реальный домен
BASE_URL = "https://www.orientwatch.uz"


@router.get("/sitemap.xml")
async def get_sitemap(db: Session = Depends(get_db)):
    """Генерация динамического sitemap.xml"""
    print("DEBUG: Generating sitemap...")
    # 1. Статические страницы (добавьте или удалите при необходимости)
    static_urls = [
        "/",
        "/catalog",
        "/collections",
        "/boutique",
        "/history",
        "/warranty",
        "/delivery",
        "/privacy",
        "/return"
    ]

    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # Добавляем статические страницы
    for url in static_urls:
        xml_content.append(f"""
    <url>
        <loc>{BASE_URL}{url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>""")

    # 2. Коллекции
    collections = db.query(Collection).filter(Collection.active == True).all()
    for col in collections:
        # Используем дату создания или текущую дату, если нет даты обновления
        date_str = col.created_at.date().isoformat() if col.created_at else datetime.now().date().isoformat()
        xml_content.append(f"""
    <url>
        <loc>{BASE_URL}/collections/{col.id}</loc>
        <lastmod>{date_str}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>""")

    # 3. Товары
    products = db.query(Product).filter(Product.in_stock == True).all()
    for prod in products:
        # Дата последнего обновления товара
        updated_date = prod.updated_at.date().isoformat() if prod.updated_at else datetime.now().date().isoformat()
        xml_content.append(f"""
    <url>
        <loc>{BASE_URL}/product/{prod.id}</loc>
        <lastmod>{updated_date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>""")

    xml_content.append('</urlset>')

    # Возвращаем XML ответ
    return Response(content="".join(xml_content), media_type="application/xml")