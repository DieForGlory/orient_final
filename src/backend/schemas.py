"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

# Auth schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

# Product schemas
class ProductBase(BaseModel):
    name: str
    collection: str
    price: float
    image: Optional[str] = None
    images: Optional[List[str]] = []
    description: Optional[str] = None
    features: Optional[List[str]] = []
    specs: Optional[Dict[str, str]] = {}
    inStock: bool = True
    stockQuantity: int = 0
    sku: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    collection: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    specs: Optional[Dict[str, str]] = None
    inStock: Optional[bool] = None
    stockQuantity: Optional[int] = None

# Collection schemas
class CollectionBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    number: Optional[str] = None
    active: bool = True

class CollectionCreate(CollectionBase):
    pass

class CollectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    number: Optional[str] = None
    active: Optional[bool] = None

# Order schemas
class OrderItem(BaseModel):
    productId: str
    quantity: int
    price: float

class CustomerData(BaseModel):
    fullName: str
    email: EmailStr
    phone: str

class DeliveryAddress(BaseModel):
    address: str
    city: str
    postalCode: str
    country: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    customer: CustomerData
    deliveryMethod: str
    paymentMethod: str
    deliveryAddress: Optional[DeliveryAddress] = None
    subtotal: float
    shipping: float
    total: float
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None

# Content schemas
class HeroContent(BaseModel):
    title: str
    subtitle: str
    image: str
    ctaText: str
    ctaLink: str

class PromoBanner(BaseModel):
    text: str
    code: str
    active: bool
    backgroundColor: str
    textColor: str
    highlightColor: str

class FeaturedWatch(BaseModel):
    productId: str
    order: int
    isNew: bool

class HeritageSection(BaseModel):
    title: str
    subtitle: str
    description: str
    ctaText: str
    ctaLink: str
    yearsText: str

# Booking schemas
class BookingCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    date: str
    time: str
    message: Optional[str] = None
    boutique: Optional[str] = "Orient Ташкент"

class BookingUpdate(BaseModel):
    status: str  # pending, confirmed, completed, cancelled

class BookingResponse(BaseModel):
    id: int
    booking_number: str
    name: str
    phone: str
    email: str
    date: str
    time: str
    message: Optional[str]
    status: str
    boutique: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True