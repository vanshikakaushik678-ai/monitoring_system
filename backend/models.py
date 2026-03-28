import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        app TEXT,
        time TEXT
    )
    """)

    conn.commit()
    conn.close()


def create_user(username, password):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    hashed = generate_password_hash(password)

    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Create user error:", e)
        conn.close()
        return False


def verify_user(username, password):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("SELECT password FROM users WHERE username=?", (username,))
    user = c.fetchone()

    conn.close()

    if user and check_password_hash(user[0], password):
        return True

    return False