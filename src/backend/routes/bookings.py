from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from database import get_db, Booking
from schemas import BookingCreate, BookingUpdate
from auth import require_admin
# Импортируем функции уведомлений
from telegram_bot import notify_new_booking, notify_booking_status

router = APIRouter()


def generate_booking_number():
    """Generate unique booking number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"BK-{timestamp}"


@router.post("/api/bookings")
async def create_booking(
        booking: BookingCreate,
        background_tasks: BackgroundTasks,  # <-- Добавили BackgroundTasks
        db: Session = Depends(get_db)
):
    if booking.website_check:
        return {"message": "Booking created successfully", "bookingNumber": "BOT-IGNORED", "id": -1}
    """Create new booking (public)"""
    booking_number = generate_booking_number()

    db_booking = Booking(
        booking_number=booking_number,
        name=booking.name,
        phone=booking.phone,
        email=booking.email,
        date=booking.date,
        time=booking.time,
        message=booking.message,
        boutique=booking.boutique,
        status="pending"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    # Отправка уведомления в Telegram (фоновая задача)
    background_tasks.add_task(notify_new_booking, db, db_booking)

    return {
        "message": "Booking created successfully",
        "bookingNumber": booking_number,
        "id": db_booking.id
    }


@router.get("/api/admin/bookings")
async def get_bookings(
        page: int = Query(1, ge=1),
        limit: int = Query(20, ge=1, le=100),
        status: Optional[str] = None,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """Get all bookings (admin)"""
    query = db.query(Booking)

    if status:
        query = query.filter(Booking.status == status)

    total = query.count()
    offset = (page - 1) * limit
    bookings = query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "data": bookings,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }


@router.get("/api/admin/bookings/{booking_id}")
async def get_booking(
        booking_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """Get booking by ID"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.put("/api/admin/bookings/{booking_id}/status")
async def update_booking_status(
        booking_id: int,
        status_update: BookingUpdate,
        background_tasks: BackgroundTasks,  # <-- Добавили BackgroundTasks
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """Update booking status"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    old_status = booking.status
    booking.status = status_update.status
    db.commit()

    # Уведомляем только если статус изменился
    if old_status != status_update.status:
        background_tasks.add_task(notify_booking_status, db, booking.booking_number, old_status, status_update.status)

    return {"message": "Booking status updated"}


@router.delete("/api/admin/bookings/{booking_id}")
async def delete_booking(
        booking_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """Delete booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted"}


@router.get("/api/admin/bookings/stats/summary")
async def get_bookings_stats(
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
):
    """Get booking statistics"""
    total = db.query(Booking).count()
    pending = db.query(Booking).filter(Booking.status == "pending").count()
    confirmed = db.query(Booking).filter(Booking.status == "confirmed").count()

    return {
        "total": total,
        "pending": pending,
        "confirmed": confirmed
    }