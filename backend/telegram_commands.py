import requests
import time
import pyautogui
import os
import pygetwindow as gw
import sys
sys.stdout.reconfigure(encoding='utf-8')

BOT_TOKEN = "8727036317:AAGQwqTH0WVT1a7aFHsm1i0WwkxFrqHbSNI"
CHAT_ID = "7988884534"

last_update_id = None


def get_updates():
    global last_update_id
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"

    try:
        res = requests.get(url).json()

        if "result" in res:
            for update in res["result"]:
                update_id = update["update_id"]

                if last_update_id is None or update_id > last_update_id:
                    last_update_id = update_id

                    if "message" in update:
                        msg = update["message"]
                        if "text" in msg:
                            return msg["text"]

    except Exception as e:
        print("Error:", e)

    return None


def handle_command(cmd):
    try:
        if cmd == "/status":
            win = gw.getActiveWindow()
            return f"💻 Active App: {win.title}" if win else "No active window"

        elif cmd == "/screenshot":
            img = pyautogui.screenshot()
            img.save("screen.png")
            return "screenshot"

        elif cmd == "/lock":
            os.system("rundll32.exe user32.dll,LockWorkStation")
            return "🔒 System Locked"

        return "Unknown command"

    except Exception as e:
        return f"Error: {str(e)}"


def send_message(msg):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    requests.post(url, data={"chat_id": CHAT_ID, "text": msg})


def send_photo(path):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    with open(path, "rb") as img:
        requests.post(url, files={"photo": img}, data={"chat_id": CHAT_ID})


def run_bot():
    print(" Bot Running...")

    while True:
        cmd = get_updates()

        if cmd:
            print("Command:", cmd)
            result = handle_command(cmd)

            if result == "screenshot":
                send_photo("screen.png")
            else:
                send_message(result)

        time.sleep(3)


if __name__ == "__main__":
    run_bot()