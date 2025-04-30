import network
from time import sleep
import mip

ssid = "em"
key = "estacao-meteorologica"

wlan = network.WLAN()
wlan.active(True)

try:
    wlan.connect(ssid, key)

    for i in range(10):
        print("Conectando ao WiFi...")
        sleep(1)
        if wlan.isconnected():
            print("Conectado ao WiFi!")
            mip.install("umqtt.simple")
            break
except Exception as e:
    print("Falha ao conectar ao WiFi:", e)
