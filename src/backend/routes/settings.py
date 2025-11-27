"""
Settings routes - Site configuration
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db, Settings
from auth import require_admin

router = APIRouter()

# Pydantic models
class SiteInfo(BaseModel):
    name: str
    email: str
    phone: str
    address: str

class ShippingInfo(BaseModel):
    freeShippingThreshold: float
    standardCost: float
    expressCost: float

class CurrencyInfo(BaseModel):
    code: str
    symbol: str

class SocialInfo(BaseModel):
    facebook: str
    instagram: str
    twitter: str

class SettingsData(BaseModel):
    site: SiteInfo
    shipping: ShippingInfo
    currency: CurrencyInfo
    social: SocialInfo

# Admin endpoints
@router.get("/api/admin/settings")
async def get_settings(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get site settings (admin)"""
    settings = db.query(Settings).filter(Settings.id == 1).first()
    
    if not settings:
        # Create default settings
        settings = Settings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "site": {
            "name": settings.site_name,
            "email": settings.site_email,
            "phone": settings.site_phone,
            "address": settings.site_address
        },
        "shipping": {
            "freeShippingThreshold": settings.free_shipping_threshold,
            "standardCost": settings.standard_shipping_cost,
            "expressCost": settings.express_shipping_cost
        },
        "currency": {
            "code": settings.currency_code,
            "symbol": settings.currency_symbol
        },
        "social": {
            "facebook": settings.facebook_url or "",
            "instagram": settings.instagram_url or "",
            "twitter": settings.twitter_url or ""
        }
    }

@router.put("/api/admin/settings")
async def update_settings(
    data: SettingsData,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update site settings (admin)"""
    settings = db.query(Settings).filter(Settings.id == 1).first()
    
    if not settings:
        settings = Settings(id=1)
        db.add(settings)
    
    # Update site info
    settings.site_name = data.site.name
    settings.site_email = data.site.email
    settings.site_phone = data.site.phone
    settings.site_address = data.site.address
    
    # Update shipping
    settings.free_shipping_threshold = data.shipping.freeShippingThreshold
    settings.standard_shipping_cost = data.shipping.standardCost
    settings.express_shipping_cost = data.shipping.expressCost
    
    # Update currency
    settings.currency_code = data.currency.code
    settings.currency_symbol = data.currency.symbol
    
    # Update social
    settings.facebook_url = data.social.facebook
    settings.instagram_url = data.social.instagram
    settings.twitter_url = data.social.twitter
    
    db.commit()
    
    return {"message": "Settings updated successfully"}

# Public endpoint for currency
@router.get("/api/settings/currency")
async def get_currency(db: Session = Depends(get_db)):
    """Get currency settings (public)"""
    settings = db.query(Settings).filter(Settings.id == 1).first()
    
    if not settings:
        return {
            "code": "UZS",
            "symbol": "₽"
        }
    
    return {
        "code": settings.currency_code,
        "symbol": settings.currency_symbol
    }
