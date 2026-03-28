from flask import Flask, request, jsonify
from flask_cors import CORS
from notifier import send_telegram
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import sqlite3
from models import init_db, create_user, verify_user
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # allow frontend requests

app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)

# Initialize DB
init_db()


# -----------------------
# 🔐 Signup
# -----------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data or "username" not in data or "password" not in data:
        return jsonify({"msg": "Missing data"}), 400

    success = create_user(data["username"], data["password"])
    if success:
        return jsonify({"msg": "User created"})
    return jsonify({"msg": "User already exists"}), 400


# -----------------------
# 🔐 Login
# -----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if verify_user(data["username"], data["password"]):
        token = create_access_token(identity=data["username"])
        return jsonify({"token": token})
    return jsonify({"msg": "Invalid credentials"}), 401


# -----------------------
# 📥 Log activity
# -----------------------
@app.route("/log", methods=["POST"])
@jwt_required()
def log():
    user = get_jwt_identity()
    data = request.json

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO logs (user, app, time) VALUES (?, ?, ?)",
        (user, data.get("app"), data.get("time"))
    )
    conn.commit()
    conn.close()

    # Telegram alert
    send_telegram(f"📢 {user} opened: {data.get('app')}")
    if data.get("app") and "incognito" in data.get("app").lower():
        send_telegram("⚠️ Incognito mode detected!")

    return jsonify({"msg": "saved"})


# -----------------------
# 📊 Get logs
# -----------------------
@app.route("/logs", methods=["GET"])
@jwt_required()
def logs():
    user = get_jwt_identity()
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "SELECT app, time FROM logs WHERE user=? ORDER BY id DESC LIMIT 20",
        (user,)
    )
    data = c.fetchall()
    conn.close()
    return jsonify(data)


# -----------------------
# 🌐 Serve frontend pages
# -----------------------
@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_pages(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    return "Page not found", 404


# -----------------------
# 🔔 Dashboard APIs
# -----------------------

# Mock device status (replace with real data logic)
@app.route('/api/devices', methods=['GET'])
@jwt_required()
def get_devices():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    # Assuming a devices table: id, name, status
    c.execute("SELECT id, name, status FROM devices")
    rows = c.fetchall()
    conn.close()
    devices = [{"id": r[0], "name": r[1], "status": r[2]} for r in rows]
    return jsonify(devices)


# Get recent alerts
@app.route('/api/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT user, app, time FROM logs ORDER BY id DESC LIMIT 5")
    rows = c.fetchall()
    conn.close()
    alerts = [{"device": r[1], "time": r[2], "user": r[0], "alert": f"{r[1]} opened by {r[0]}"} for r in rows]
    return jsonify(alerts)


if __name__ == "__main__":
    app.run(debug=True)