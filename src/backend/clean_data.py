"""
Script to clean Orders and Bookings from database.
WARNING: This will delete all order history and boutique appointments.
"""
from database import SessionLocal, Order, Booking


def clean_orders_and_bookings():
    # Создаем сессию подключения к БД
    db = SessionLocal()
    try:
        print("⏳ Начинаю очистку заказов и бронирований...")

        # 1. Удаляем все записи из таблицы bookings (Бронирования)
        # synchronize_session=False используется для эффективного массового удаления
        deleted_bookings = db.query(Booking).delete(synchronize_session=False)
        print(f"✅ Удалено записей в бутик: {deleted_bookings}")

        # 2. Удаляем все записи из таблицы orders (Заказы)
        deleted_orders = db.query(Order).delete(synchronize_session=False)
        print(f"✅ Удалено заказов: {deleted_orders}")

        # Подтверждаем изменения в базе
        db.commit()
        print("\n🎉 Очистка завершена успешно! База данных свободна от старых заказов.")

    except Exception as e:
        print(f"❌ Ошибка при выполнении: {e}")
        # В случае ошибки отменяем все изменения
        db.rollback()
    finally:
        # Закрываем соединение
        db.close()


if __name__ == "__main__":
    print("⚠️ ВНИМАНИЕ: Вы собираетесь удалить ВСЕ заказы и записи на визит.")
    print("Остальные данные (товары, пользователи, настройки) не будут затронуты.")

    confirm = input("Вы уверены, что хотите продолжить? (y/n): ")

    if confirm.lower() == 'y':
        clean_orders_and_bookings()
    else:
        print("❌ Операция отменена.")