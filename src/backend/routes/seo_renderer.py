import os
import re
from fastapi import APIRouter, Request, Depends, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from database import get_db, Product, Collection
import json

router = APIRouter()

# --- 1. SEO ДАННЫЕ ИЗ ВАШЕГО ФАЙЛА ---
STATIC_SEO = {
    # Главная страница
    "": {
        "title": "Orient Watch Uzbekistan. Купить часы Orient в Ташкенте. Официальный дилер Orient Watch в Узбекистане.",
        "description": "Оригинальные японские часы Orient в Узбекистане. Купить механические и кварцевые часы с официальной гарантией 2 года. Доставка по Ташкенту и всему Узбекистану."
    },
    # Бутик
    "boutique": {
        "title": "Бутик Официального дилера Orient Watch в Узбекистане | Orient Watch Uzbekistan",
        "description": "Официальный Бутик Orient Watch в Ташкенте: г.Ташкент, ул.Аккурган, 24, +998 88 281-28-28, Пн-Сб: 11:00 - 19:00 Вс: 12:00 - 18:00. Запишитесь на примерку оригинальных японских часов с гарантией. Официальный дилер Orient Watch в Узбекистане."
    },
    # История
    "history": {
        "title": "История бренда Orient Watch – С 1950 года японское мастерство часов | Orient Watch Uzbekistan",
        "description": "Изучите историю Orient Watch: от основания в 1950 году в Японии - до инноваций в механических часах. Ключевые milestones, традиции качества и глобальный успех. Официальный сайт в Узбекистане. Официальный дилер Orient Watch в Узбекистане."
    },
    # Каталог
    "catalog": {
        "title": "Каталог часов Orient Watch – Все модели и официальные цены в Узбекистане | Orient Watch Uzbekistan",
        "description": "Каталог оригинальных часов Orient Watch Uzbekistan: механические, кварцевые, дайверы и классика. Купить с доставкой по Узбексистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
    },
    # Коллекции (общая)
    "collections": {
        "title": "Коллекции Orient Watch – Sports, Classic, Bambino, Revival, Contemporary |Orient Watch Uzbekistan",
        "description": "Обзор коллекций часов Orient. Купить с доставкой по Узбексистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
    },
    # --- КОЛЛЕКЦИИ ---
    "collection/sports": {
        "title": "Коллекция Sports Orient Watch – Спортивные часы для активного образа | Orient Watch Uzbekistan",
        "description": "Спортивные часы Orient Sports: водозащита до 200м, ударопрочность и надежный механизм. Идеальный выбор для дайвинга и спорта. Купить с доставкой по Узбекистану."
    },
    "collection/contemporary": {
        "title": "Коллекция Contemporary Orient – Современные часы | Orient Watch Uzbekistan",
        "description": "Современные часы Orient Contemporary: минималистичный дизайн, многофункциональные циферблаты, кварц и автомат. Купить с доставкой по Узбексистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
    },
    "collection/revival": {
        "title": "Коллекция Revival Orient – Ретро-часы с винтажным шармом | Orient Watch Uzbekistan",
        "description": "Ретро-часы Orient Revival: винтажный дизайн, механика и кварц, аутентичные дизайны. Купить с доставкой по Узбексистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
    },
    "collection/bambino": {
        "title": "Коллекция Bambino Orient – Классика с открытым балансом | Orient Watch Uzbekistan",
        "description": "Bambino Orient: автоматические часы с open heart, выпуклым стеклом и римскими цифрами. Купить с доставкой по Узбексистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
    }
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")
INDEX_PATH = os.path.join(DIST_DIR, "index.html")


@router.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str, db: Session = Depends(get_db)):
    # 1. Если это файл (есть точка в конце, например .js, .png), отдаем 404
    if "." in full_path.split("/")[-1]:
        return Response(status_code=404)

    # 2. Читаем HTML
    if not os.path.exists(INDEX_PATH):
        return Response("Index file not found. Run npm run build", status_code=500)

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Дефолтные значения
    final_title = "Orient Watch Uzbekistan | Официальный дилер"
    final_desc = "Купить японские наручные часы Orient в Ташкенте. Официальный дилер, гарантия 2 года, бесплатная доставка."
    final_image = "/assets/og-image.jpg"

    clean_path = full_path.strip("/")

    # --- ЛОГИКА ---
    if clean_path in STATIC_SEO:
        data = STATIC_SEO[clean_path]
        final_title = data["title"]
        final_desc = data["description"]

    elif clean_path.startswith("product/"):
        slug = clean_path.split("/")[-1]
        product = db.query(Product).filter(Product.slug == slug).first()
        if product:
            final_title = f"{product.name} | Orient Watch Uzbekistan"
            final_desc = product.meta_description if product.meta_description else f"Купить часы {product.name}. Артикул: {product.sku}."
            if product.images:
                try:
                    images = json.loads(product.images)
                    if images: final_image = f"/uploads/{images[0]}"
                except:
                    pass

    elif clean_path.startswith("collection/") and clean_path not in STATIC_SEO:
        slug = clean_path.split("/")[-1]
        collection = db.query(Collection).filter(Collection.slug == slug).first()
        if collection:
            final_title = f"Коллекция {collection.name} | Orient Watch"
            final_desc = collection.description[:200] if collection.description else final_desc

    # --- ЗАМЕНА ---
    html_content = re.sub(r"<title>.*?</title>", f"<title>{final_title}</title>", html_content, flags=re.DOTALL)

    meta_desc_tag = f'<meta name="description" content="{final_desc}" />'
    if '<meta name="description"' in html_content:
        html_content = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', meta_desc_tag, html_content)
    else:
        html_content = html_content.replace("</head>", f"{meta_desc_tag}\n</head>")

    full_image_url = f"https://orientwatch.uz{final_image}" if final_image.startswith("/") else final_image
    og_tags = f"""
    <meta property="og:title" content="{final_title}" />
    <meta property="og:description" content="{final_desc}" />
    <meta property="og:image" content="{full_image_url}" />
    <meta property="og:url" content="https://orientwatch.uz/{clean_path}" />
    <meta property="og:type" content="website" />
    """
    html_content = html_content.replace("</head>", f"{og_tags}\n</head>")

    return HTMLResponse(content=html_content, status_code=200)