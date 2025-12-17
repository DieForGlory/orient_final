# src/backend/routes/seo_renderer.py

import os
from fastapi import APIRouter, Request, Depends, Response
from sqlalchemy.orm import Session
from database import get_db, Product, Collection
from fastapi.responses import HTMLResponse

router = APIRouter()

# ПУТЬ К ПАПКЕ СО СБОРКОЙ ФРОНТЕНДА (dist)
# Поднимаемся на 3 уровня вверх от routes: routes -> backend -> src -> корень -> dist
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
DIST_DIR = os.path.join(BASE_DIR, "dist")
INDEX_HTML_PATH = os.path.join(DIST_DIR, "index.html")


def get_base_html():
    """Читает index.html с диска"""
    if os.path.exists(INDEX_HTML_PATH):
        with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
            return f.read()
    # Фоллбэк, если билд еще не сделан (для локальной разработки)
    return """<!doctype html><html><head><title>Orient Watch Uzbekistan</title></head><body><div id="root">Frontend not built or path incorrect</div></body></html>"""


def inject_meta(html: str, title: str, description: str, image: str = ""):
    """Вставляет SEO и OpenGraph теги в HTML"""

    # 1. Заменяем Title
    # Ищем точный тег из вашего index.html
    html = html.replace("<title>Orient Watch Uzbekistan</title>", f"<title>{title}</title>")

    # 2. Формируем новые мета-теги
    meta_tags = f"""
    <meta name="description" content="{description}">

    <meta property="og:type" content="website">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="https://orientwatch.uz/">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{image}">
    """

    # 3. Вставляем их перед закрывающим </head>
    return html.replace("</head>", f"{meta_tags}</head>")


@router.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_spa_with_seo(request: Request, full_path: str, db: Session = Depends(get_db)):
    """
    Универсальный обработчик для всех страниц.
    Определяет тип страницы по URL и отдает HTML с правильными тегами.
    """
    # Пропускаем запросы к API и файлам (если они вдруг дошли сюда)
    if full_path.startswith("api/") or full_path.startswith("uploads/") or "." in full_path.split("/")[-1]:
        return Response(status_code=404)

    html = get_base_html()

    # Значения по умолчанию (Главная страница)
    title = "Orient Watch Uzbekistan | Официальный дилер"
    description = "Официальный сайт Orient Watch в Узбекистане. Оригинальные японские часы, гарантия 2 года, бесплатная доставка по Ташкенту."
    image = "https://orientwatch.uz/assets/og-image-default.jpg"  # Желательно создать такую картинку

    path_parts = full_path.strip("/").split("/")

    # Логика определения страницы

    # 1. Страница товара: /product/{id}
    if len(path_parts) >= 2 and path_parts[0] == "product":
        product_id = path_parts[1]
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            # Используем SEO поля если заполнены, иначе генерируем
            title = product.seo_title if product.seo_title else f"{product.name} | Orient Watch Uzbekistan"

            desc_text = product.seo_description if product.seo_description else f"Купить часы {product.name} из коллекции {product.collection}. Официальная гарантия, лучшая цена."
            description = desc_text

            # Картинка товара (если есть)
            if product.image:
                # Добавляем домен, если путь относительный
                if product.image.startswith("http"):
                    image = product.image
                else:
                    image = f"https://orientwatch.uz{product.image}"

    # 2. Страница коллекции: /collection/{id}
    elif len(path_parts) >= 2 and path_parts[0] == "collection":
        collection_id = path_parts[1]
        collection = db.query(Collection).filter(Collection.id == collection_id).first()
        if collection:
            title = f"Коллекция {collection.name} | Orient Watch"
            description = collection.description[
                          :200] + "..." if collection.description else f"Часы Orient коллекции {collection.name}. Японское качество."
            if collection.image:
                if collection.image.startswith("http"):
                    image = collection.image
                else:
                    image = f"https://orientwatch.uz{collection.image}"

    # 3. Каталог: /catalog
    elif path_parts[0] == "catalog":
        title = "Каталог часов Orient Watch | Все модели"
        description = "Полный каталог часов Orient в Узбекистане: механика, кварц, дайверские часы. Удобный фильтр и подбор."

    # 4. Бутик: /boutique
    elif path_parts[0] == "boutique":
        title = "Бутик Orient Watch в Ташкенте"
        description = "Посетите наш флагманский бутик. Примерка часов, профессиональная консультация. Адрес: г. Ташкент, ул. Аккурган, 24."

    # 5. История: /history
    elif path_parts[0] == "history":
        title = "История бренда Orient Watch | С 1950 года"
        description = "Путь японского мастерства длиной в 70 лет. История создания легендарных механизмов Orient."

    # Внедряем теги и отдаем результат
    final_html = inject_meta(html, title, description, image)
    return HTMLResponse(content=final_html)