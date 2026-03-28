import requests

BOT_TOKEN = "8727036317:AAGQwqTH0WVT1a7aFHsm1i0WwkxFrqHbSNI"
CHAT_ID = "7988884534"

def send_telegram(msg):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    try:
        requests.post(url, data={
            "chat_id": CHAT_ID,
            "text": msg
        }, timeout=5)
    except Exception as e:
        print("Telegram Error:", e)