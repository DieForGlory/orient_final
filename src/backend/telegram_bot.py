import httpx
import json
import asyncio
from sqlalchemy.orm import Session
from database import Settings


async def send_message(token: str, chat_id: str, text: str):
    if not token or not chat_id:
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json={
                "chat_id": chat_id.strip(),
                "text": text,
                "parse_mode": "HTML"
            })
        except Exception as e:
            print(f"Error sending telegram message: {e}")


async def broadcast_message(db: Session, message: str):
    settings = db.query(Settings).filter(Settings.id == 1).first()
    if not settings or not settings.telegram_bot_token or not settings.telegram_chat_ids:
        return

    token = settings.telegram_bot_token
    chat_ids = settings.telegram_chat_ids.split(",")

    tasks = [send_message(token, chat_id, message) for chat_id in chat_ids if chat_id.strip()]
    if tasks:
        await asyncio.gather(*tasks)


# --- Уведомления о ЗАКАЗАХ ---
async def notify_new_order(db: Session, order):
    try:
        customer = json.loads(order.customer_data) if order.customer_data else {}
        name = customer.get("fullName", "Не указано")
        phone = customer.get("phone", "Не указано")

        msg = (
            f"🔔 <b>Новый заказ!</b>\n\n"
            f"🆔 <b>Номер:</b> {order.order_number}\n"
            f"👤 <b>Клиент:</b> {name}\n"
            f"📞 <b>Телефон:</b> {phone}\n"
            f"💰 <b>Сумма:</b> {order.total:,.0f} UZS\n"
            f"🚚 <b>Доставка:</b> {order.delivery_method}\n"
            f"💳 <b>Оплата:</b> {order.payment_method}"
        )
        await broadcast_message(db, msg)
    except Exception as e:
        print(f"Failed to prepare order notification: {e}")


async def notify_order_status(db: Session, order_number: str, old_status: str, new_status: str):
    try:
        msg = (
            f"🔄 <b>Статус заказа изменен</b>\n\n"
            f"🆔 <b>Номер:</b> {order_number}\n"
            f"▫️ <b>Было:</b> {old_status}\n"
            f"▪️ <b>Стало:</b> {new_status}"
        )
        await broadcast_message(db, msg)
    except Exception as e:
        print(f"Failed to prepare status notification: {e}")


# --- Уведомления о БРОНИРОВАНИЯХ (НОВОЕ) ---
async def notify_new_booking(db: Session, booking):
    try:
        msg = (
            f"📅 <b>Новая запись в бутик!</b>\n\n"
            f"🆔 <b>Номер:</b> {booking.booking_number}\n"
            f"👤 <b>Имя:</b> {booking.name}\n"
            f"📞 <b>Телефон:</b> {booking.phone}\n"
            f"🗓 <b>Дата:</b> {booking.date}\n"
            f"⏰ <b>Время:</b> {booking.time}\n"
            f"📍 <b>Бутик:</b> {booking.boutique}\n"
        )
        if booking.message:
            msg += f"💬 <b>Комментарий:</b> {booking.message}"

        await broadcast_message(db, msg)
    except Exception as e:
        print(f"Failed to prepare booking notification: {e}")


async def notify_booking_status(db: Session, booking_number: str, old_status: str, new_status: str):
    try:
        msg = (
            f"🔄 <b>Статус записи изменен</b>\n\n"
            f"🆔 <b>Номер:</b> {booking_number}\n"
            f"▫️ <b>Было:</b> {old_status}\n"
            f"▪️ <b>Стало:</b> {new_status}"
        )
        await broadcast_message(db, msg)
    except Exception as e:
        print(f"Failed to prepare booking status notification: {e}")