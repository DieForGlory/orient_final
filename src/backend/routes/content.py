"""
Content management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database import get_db, ContentHero, ContentPromoBanner, ContentHeritage, ContentSiteLogo, Product
from schemas import HeroContent, PromoBanner, HeritageSection
from auth import require_admin

router = APIRouter()

# Pydantic model for logo
class SiteLogo(BaseModel):
    logoUrl: str
    logoDarkUrl: str | None = None

# Public endpoints
@router.get("/api/content/logo")
async def get_site_logo(db: Session = Depends(get_db)):
    """Get site logo (public)"""
    logo = db.query(ContentSiteLogo).filter(ContentSiteLogo.id == 1).first()
    
    if not logo:
        return {
            "logoUrl": "https://via.placeholder.com/150x50?text=ORIENT",
            "logoDarkUrl": None
        }
    
    return {
        "logoUrl": logo.logo_url,
        "logoDarkUrl": logo.logo_dark_url
    }

@router.get("/api/content/hero")
async def get_hero_content(db: Session = Depends(get_db)):
    """Get hero content (public)"""
    hero = db.query(ContentHero).filter(ContentHero.id == 1).first()
    
    if not hero:
        # Return default
        return {
            "title": "НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.",
            "subtitle": "Японское мастерство и точность в каждой детали",
            "image": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
            "ctaText": "Смотреть коллекцию",
            "ctaLink": "/catalog"
        }
    
    return {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "image": hero.image,
        "ctaText": hero.cta_text,
        "ctaLink": hero.cta_link
    }

@router.get("/api/content/promo-banner")
async def get_promo_banner(db: Session = Depends(get_db)):
    """Get promo banner (public)"""
    banner = db.query(ContentPromoBanner).filter(ContentPromoBanner.id == 1).first()
    
    if not banner:
        return {
            "text": "СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ",
            "code": "PRE2025",
            "active": True,
            "backgroundColor": "#000000",
            "textColor": "#FFFFFF",
            "highlightColor": "#C8102E"
        }
    
    return {
        "text": banner.text,
        "code": banner.code,
        "active": banner.active,
        "backgroundColor": banner.background_color,
        "textColor": banner.text_color,
        "highlightColor": banner.highlight_color
    }

@router.get("/api/content/featured-watches")
async def get_featured_watches(db: Session = Depends(get_db)):
    """Get featured watches (public)"""
    # Return featured products (is_featured = True)
    products = db.query(Product).filter(Product.is_featured == True).limit(6).all()
    
    result = []
    for product in products:
        result.append({
            "id": str(product.id),
            "name": product.name,
            "collection": product.collection,
            "price": product.price,
            "image": product.image,
            "isNew": True  # Can be extended with a field in Product model
        })
    
    return result

@router.get("/api/content/heritage")
async def get_heritage_section(db: Session = Depends(get_db)):
    """Get heritage section (public)"""
    heritage = db.query(ContentHeritage).filter(ContentHeritage.id == 1).first()
    
    if not heritage:
        return {
            "title": "75 лет\nмастерства",
            "subtitle": "С 1950 года",
            "description": "Orient создает механические часы высочайшего качества, объединяя традиционное японское мастерство с современными технологиями.",
            "ctaText": "Узнать историю",
            "ctaLink": "/history",
            "yearsText": "75"
        }
    
    return {
        "title": heritage.title,
        "subtitle": heritage.subtitle,
        "description": heritage.description,
        "ctaText": heritage.cta_text,
        "ctaLink": heritage.cta_link,
        "yearsText": heritage.years_text
    }

# Admin endpoints
@router.get("/api/admin/content/logo")
async def get_site_logo_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get site logo (admin)"""
    logo = db.query(ContentSiteLogo).filter(ContentSiteLogo.id == 1).first()
    
    if not logo:
        return {
            "logoUrl": "https://via.placeholder.com/150x50?text=ORIENT",
            "logoDarkUrl": None
        }
    
    return {
        "logoUrl": logo.logo_url,
        "logoDarkUrl": logo.logo_dark_url
    }

@router.put("/api/admin/content/logo")
async def update_site_logo(
    logo: SiteLogo,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update site logo (admin)"""
    db_logo = db.query(ContentSiteLogo).filter(ContentSiteLogo.id == 1).first()
    
    if not db_logo:
        db_logo = ContentSiteLogo(id=1)
        db.add(db_logo)
    
    db_logo.logo_url = logo.logoUrl
    db_logo.logo_dark_url = logo.logoDarkUrl
    
    db.commit()
    
    return {"message": "Logo updated"}

@router.get("/api/admin/content/hero")
async def get_hero_content_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get hero content (admin)"""
    hero = db.query(ContentHero).filter(ContentHero.id == 1).first()
    
    if not hero:
        # Return default
        return {
            "title": "НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.",
            "subtitle": "Японское мастерство и точность в каждой детали",
            "image": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
            "ctaText": "Смотреть коллекцию",
            "ctaLink": "/catalog"
        }
    
    return {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "image": hero.image,
        "ctaText": hero.cta_text,
        "ctaLink": hero.cta_link
    }

@router.put("/api/admin/content/hero")
async def update_hero_content(
    content: HeroContent,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update hero content (admin)"""
    hero = db.query(ContentHero).filter(ContentHero.id == 1).first()
    
    if not hero:
        hero = ContentHero(id=1)
        db.add(hero)
    
    hero.title = content.title
    hero.subtitle = content.subtitle
    hero.image = content.image
    hero.cta_text = content.ctaText
    hero.cta_link = content.ctaLink
    
    db.commit()
    
    return {"message": "Hero content updated"}

@router.get("/api/admin/content/promo-banner")
async def get_promo_banner_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get promo banner (admin)"""
    banner = db.query(ContentPromoBanner).filter(ContentPromoBanner.id == 1).first()
    
    if not banner:
        return {
            "text": "СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ",
            "code": "PRE2025",
            "active": True,
            "backgroundColor": "#000000",
            "textColor": "#FFFFFF",
            "highlightColor": "#C8102E"
        }
    
    return {
        "text": banner.text,
        "code": banner.code,
        "active": banner.active,
        "backgroundColor": banner.background_color,
        "textColor": banner.text_color,
        "highlightColor": banner.highlight_color
    }

@router.put("/api/admin/content/promo-banner")
async def update_promo_banner(
    banner: PromoBanner,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update promo banner (admin)"""
    db_banner = db.query(ContentPromoBanner).filter(ContentPromoBanner.id == 1).first()
    
    if not db_banner:
        db_banner = ContentPromoBanner(id=1)
        db.add(db_banner)
    
    db_banner.text = banner.text
    db_banner.code = banner.code
    db_banner.active = banner.active
    db_banner.background_color = banner.backgroundColor
    db_banner.text_color = banner.textColor
    db_banner.highlight_color = banner.highlightColor
    
    db.commit()
    
    return {"message": "Promo banner updated"}

@router.get("/api/admin/content/featured-watches")
async def get_featured_watches_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get featured watches (admin)"""
    # Return featured products (is_featured = True)
    products = db.query(Product).filter(Product.is_featured == True).limit(6).all()
    
    result = []
    for product in products:
        result.append({
            "id": str(product.id),
            "name": product.name,
            "collection": product.collection,
            "price": product.price,
            "image": product.image,
            "isNew": True
        })
    
    return result

@router.put("/api/admin/content/featured-watches")
async def update_featured_watches(
    product_ids: list[str],
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update featured watches - mark products as featured (admin)"""
    # Unmark all products
    db.query(Product).update({"is_featured": False})
    
    # Mark selected products as featured
    for product_id in product_ids:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.is_featured = True
    
    db.commit()
    
    return {"message": "Featured watches updated"}

@router.get("/api/admin/content/heritage")
async def get_heritage_section_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get heritage section (admin)"""
    heritage = db.query(ContentHeritage).filter(ContentHeritage.id == 1).first()
    
    if not heritage:
        return {
            "title": "75 лет\nмастерства",
            "subtitle": "С 1950 года",
            "description": "Orient создает механические часы высочайшего качества, объединяя традиционное японское мастерство с современными технологиями.",
            "ctaText": "Узнать историю",
            "ctaLink": "/history",
            "yearsText": "75"
        }
    
    return {
        "title": heritage.title,
        "subtitle": heritage.subtitle,
        "description": heritage.description,
        "ctaText": heritage.cta_text,
        "ctaLink": heritage.cta_link,
        "yearsText": heritage.years_text
    }

@router.put("/api/admin/content/heritage")
async def update_heritage_section(
    heritage: HeritageSection,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update heritage section (admin)"""
    db_heritage = db.query(ContentHeritage).filter(ContentHeritage.id == 1).first()
    
    if not db_heritage:
        db_heritage = ContentHeritage(id=1)
        db.add(db_heritage)
    
    db_heritage.title = heritage.title
    db_heritage.subtitle = heritage.subtitle
    db_heritage.description = heritage.description
    db_heritage.cta_text = heritage.ctaText
    db_heritage.cta_link = heritage.ctaLink
    db_heritage.years_text = heritage.yearsText
    
    db.commit()
    
    return {"message": "Heritage section updated"}