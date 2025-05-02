import dotenv
from machine import Pin
import network
from time import sleep
import mip


dotenv.load_dotenv()

p2 = Pin(2, Pin.OUT)
wlan = network.WLAN()
wlan.active(True)

try:
    wlan.connect(WIFI_SSID, WIFI_KEY)

    for i in range(15):
        print("Conectando ao WiFi...")
        sleep(1)

        if wlan.isconnected():
            print("Conectado ao WiFi!")
            mip.install("umqtt.simple")
            break
        
except Exception as e:
    print("Falha ao conectar ao WiFi:", e)

finally:
    p2.on()
