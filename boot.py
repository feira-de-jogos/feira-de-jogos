import dotenv
from machine import Pin
import network
from time import sleep

dotenv.load_env()

p2 = Pin(2, Pin.OUT)
p2.off()
wlan = network.WLAN()
wlan.active(True)

try:
    wlan.connect(dotenv.WIFI_SSID, dotenv.WIFI_KEY)

    for i in range(15):
        print("Conectando ao WiFi...")
        sleep(1)

        if wlan.isconnected():
            print("Conectado ao WiFi!")
            break

except Exception as e:
    print("Falha ao conectar ao WiFi:", e)
