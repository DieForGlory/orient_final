import os
import re
from fastapi import APIRouter, Request, Depends, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from database import get_db, Product, Collection
import json

router = APIRouter()

# --- 1. SEO ДАННЫЕ (Статические страницы) ---
STATIC_SEO = {
    "": {
        "title": "Orient Watch Uzbekistan. Купить часы Orient в Ташкенте. Официальный дилер Orient Watch в Узбекистане.",
        "description": "Оригинальные японские часы Orient в Узбекистане. Купить механические и кварцевые часы с официальной гарантией 2 года. Доставка по Ташкенту и всему Узбекистану."
    },
    "boutique": {
        "title": "Бутик Официального дилера Orient Watch в Узбекистане | Orient Watch Uzbekistan",
        "description": "Официальный Бутик Orient Watch в Ташкенте: г.Ташкент, ул.Аккурган, 24, +998 88 281-28-28. Запишитесь на примерку оригинальных японских часов с гарантией."
    },
    "history": {
        "title": "История бренда Orient Watch – С 1950 года японское мастерство часов | Orient Watch Uzbekistan",
        "description": "Изучите историю Orient Watch: от основания в 1950 году в Японии до инноваций в механических часах. Ключевые milestones, традиции качества и глобальный успех."
    },
    "catalog": {
        "title": "Каталог часов Orient Watch – Все модели и официальные цены в Узбекистане",
        "description": "Каталог оригинальных часов Orient Watch Uzbekistan: механические, кварцевые, дайверы и классика. Купить с доставкой по Узбекистану. Гарантия 2 года."
    },
    "collections": {
        "title": "Коллекции Orient Watch – Sports, Classic, Bambino, Revival, Contemporary",
        "description": "Обзор коллекций часов Orient. Купить с доставкой по Узбекистану. Гарантия 2 года."
    },
    # Статические коллекции (если они не в базе)
    "collection/sports": {
        "title": "Коллекция Sports Orient Watch – Спортивные часы для активного образа",
        "description": "Спортивные часы Orient Sports: водозащита до 200м, ударопрочность и надежный механизм. Идеальный выбор для дайвинга и спорта."
    },
    "collection/contemporary": {
        "title": "Коллекция Contemporary Orient – Современные часы",
        "description": "Современные часы Orient Contemporary: минималистичный дизайн, многофункциональные циферблаты, кварц и автомат."
    },
    "collection/revival": {
        "title": "Коллекция Revival Orient – Ретро-часы с винтажным шармом",
        "description": "Ретро-часы Orient Revival: винтажный дизайн, механика и кварц, аутентичные дизайны."
    },
    "collection/bambino": {
        "title": "Коллекция Bambino Orient – Классика с открытым балансом",
        "description": "Bambino Orient: автоматические часы с open heart, выпуклым стеклом и римскими цифрами."
    }
}

# Определяем пути (поднимаемся на 3 уровня вверх от текущего файла)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# Проверка: если папка dist не найдена, пробуем другой уровень вложенности (на случай запуска из venv)
if not os.path.exists(os.path.join(BASE_DIR, "dist")):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DIST_DIR = os.path.join(BASE_DIR, "dist")
INDEX_PATH = os.path.join(DIST_DIR, "index.html")


@router.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str, db: Session = Depends(get_db)):
    # 1. Если это файл (есть точка в конце, например .js, .png), отдаем 404 (пусть ищет Nginx)
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

    # --- ЛОГИКА ПОДМЕНЫ ---

    # 1. Статические страницы (из словаря выше)
    if clean_path in STATIC_SEO:
        data = STATIC_SEO[clean_path]
        final_title = data["title"]
        final_desc = data["description"]

    # 2. Страница товара: /product/ID
    elif clean_path.startswith("product/"):
        product_id = clean_path.split("/")[-1]

        # !!! ИСПРАВЛЕНИЕ: Ищем по ID, а не по slug !!!
        product = db.query(Product).filter(Product.id == product_id).first()

        if product:
            # Заголовок
            final_title = product.seo_title if product.seo_title else f"{product.name} | Orient Watch Uzbekistan"

            # Описание
            if product.seo_description:
                final_desc = product.seo_description
            elif product.description:
                # Убираем HTML теги из описания для мета-тега
                clean_desc = re.sub('<[^<]+?>', '', product.description)
                final_desc = clean_desc[:160]  # Ограничиваем длину
            else:
                final_desc = f"Купить {product.name}. Артикул: {product.sku}. Официальная гарантия."

            # Картинка
            if product.images:
                try:
                    images = json.loads(product.images)
                    if images and len(images) > 0:
                        final_image = images[0]
                except:
                    pass

    # 3. Страница коллекции: /collection/ID
    elif clean_path.startswith("collection/") and clean_path not in STATIC_SEO:
        collection_id = clean_path.split("/")[-1]

        # !!! ИСПРАВЛЕНИЕ: Ищем по ID или Name !!!
        collection = db.query(Collection).filter(Collection.id == collection_id).first()
        # Если по ID не нашли, пробуем по имени (на случай ссылок вида /collection/sports)
        if not collection:
            collection = db.query(Collection).filter(Collection.name == collection_id).first()

        if collection:
            final_title = f"Коллекция {collection.name} | Orient Watch"
            if collection.description:
                final_desc = re.sub('<[^<]+?>', '', collection.description)[:160]

    # --- ЗАМЕНА В HTML ---

    # Замена Title
    html_content = re.sub(r"<title>.*?</title>", f"<title>{final_title}</title>", html_content, flags=re.DOTALL)

    # Замена Description
    meta_desc_tag = f'<meta name="description" content="{final_desc}" />'
    if '<meta name="description"' in html_content:
        html_content = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', meta_desc_tag, html_content)
    else:
        # Если тега нет, добавляем перед закрывающим head
        html_content = html_content.replace("</head>", f"{meta_desc_tag}\n</head>")

    # Добавление Open Graph (для соцсетей и мессенджеров)
    full_image_url = final_image if final_image.startswith("http") else f"https://orientwatch.uz{final_image}"

    og_tags = f"""
    <meta property="og:title" content="{final_title}" />
    <meta property="og:description" content="{final_desc}" />
    <meta property="og:image" content="{full_image_url}" />
    <meta property="og:url" content="https://orientwatch.uz/{clean_path}" />
    <meta property="og:type" content="website" />
    """
    html_content = html_content.replace("</head>", f"{og_tags}\n</head>")

    return HTMLResponse(content=html_content, status_code=200)