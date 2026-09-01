import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "mindcare.db")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE role = 'patient'")
    cursor.execute("DROP TABLE IF EXISTS verification_tokens")
    conn.commit()
    count = cursor.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    conn.close()
    print(f"[DB Cleanup Success] Cleared test patient accounts. Remaining user records: {count}")
else:
    print("[DB Cleanup] Database file does not exist yet.")
