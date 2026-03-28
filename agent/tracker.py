import time
import requests
import pygetwindow as gw
from datetime import datetime

TOKEN = "PASTE_TOKEN_AFTER_LOGIN"
URL = "http://127.0.0.1:5000/log"

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

last = ""

while True:
    try:
        win = gw.getActiveWindow()

        if win:
            title = win.title

            if title != last:
                data = {
                    "app": title,
                    "time": str(datetime.now())
                }

                requests.post(URL, json=data, headers=headers)
                print("Sent:", title)

                last = title

        time.sleep(5)

    except Exception as e:
        print(e)