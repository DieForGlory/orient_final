"""
Orient Watch - FastAPI Backend
Main application entry point
"""
import os
from dotenv import load_dotenv

# 1. Загружаем переменные окружения
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ваши модули
from database import init_db
from routes import (
    admin, products, collections, orders, content, upload,
    bookings, products_export, settings, payme, promocodes,
    sitemap,       # Sitemap для роботов
    seo_renderer   # Рендер HTML для людей и роботов
)

# Инициализация базы данных
init_db()

app = FastAPI(
    title="Orient Watch API",
    description="API for Orient Watch e-commerce platform",
    version="1.0.0"
)

# Настройка CORS
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:5174,http://localhost:8080,http://127.0.0.1:5173,http://127.0.0.1:3000,http://127.0.0.1:5174,http://127.0.0.1:8080"
)
allowed_origins = [origin.strip() for origin in cors_origins.split(",")]

print(f"🌐 CORS enabled for origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
app.include_router(sitemap.router)
# --- ПОДКЛЮЧЕНИЕ РОУТЕРОВ (API) ---
app.include_router(admin.router)
app.include_router(products_export.router)
app.include_router(products.router)
app.include_router(collections.router)
app.include_router(orders.router)
app.include_router(content.router)
app.include_router(upload.router)
app.include_router(bookings.router)
app.include_router(settings.router)
app.include_router(payme.router)
app.include_router(promocodes.router)
# Sitemap

# --- ПОДКЛЮЧЕНИЕ СТАТИКИ ---

# 1. Загруженные файлы (картинки товаров)
upload_dir = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# 2. Статика фронтенда (JS/CSS) - Исправленный путь
# Вычисляем корень проекта (на 3 уровня выше текущего файла)
BASE_DIR = "/var/www/orient"
DIST_ASSETS = os.path.join(BASE_DIR, "dist", "assets")

# Подключаем assets ТОЛЬКО если папка существует (после билда фронтенда)
if os.path.exists(DIST_ASSETS):
    app.mount("/assets", StaticFiles(directory=DIST_ASSETS), name="assets")
    print(f"✅ Assets mounted from: {DIST_ASSETS}")
else:
    print(f"⚠️ Warning: Assets directory not found at {DIST_ASSETS}. Did you run 'npm run build'?")

# --- СИСТЕМНЫЕ ЭНДПОИНТЫ ---

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api")  # Переименовали корень API, чтобы освободить "/" для сайта
def read_api_root():
    return {
        "message": "Orient Watch API",
        "version": "1.0.0",
        "status": "running"
    }

# --- SEO RENDERER (САМЫЙ ПОСЛЕДНИЙ) ---
# Перехватывает все остальные запросы (Главная, Каталог, Товар) и отдает HTML
app.include_router(seo_renderer.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on http://0.0.0.0:{port}")
    print(f"📚 API docs: http://localhost:{port}/docs")
    print(f"🗺️  Sitemap: http://localhost:{port}/sitemap.xml")
    uvicorn.run(app, host="0.0.0.0", port=port)