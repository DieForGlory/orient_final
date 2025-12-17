from database import engine, Base
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE settings ADD COLUMN telegram_bot_token VARCHAR"))
            conn.execute(text("ALTER TABLE settings ADD COLUMN telegram_chat_ids VARCHAR"))
            print("✅ Columns added successfully")
        except Exception as e:
            print(f"ℹ️ Columns might already exist or error: {e}")

if __name__ == "__main__":
    migrate()