import dotenv
from machine import Pin, reset
import network
from ntp import time
import umqtt.robust
from time import sleep

dotenv.load_env()

p2 = Pin(2, Pin.OUT)
wlan = network.WLAN()
mqtt_client = umqtt.robust.MQTTClient(
    client_id=dotenv.MQTT_CLIENT_ID, server=dotenv.MQTT_BROKER
)
err_count = 0

if wlan.isconnected():
    mqtt_client.connect()
    print("Conectado no broker MQTT!")
    p2.on()
else:
    print("Sem conexão WiFi.")
    reset()

while True:
    try:
        timestamp = time()
    except Exception as e:
        print("Problema com NTP:", e)
        err_count += 1
    else:
        payload = " ".join([dotenv.MQTT_CLIENT_ID, str(time())])
        mqtt_client.publish("em/" + dotenv.MQTT_CLIENT_ID, payload, qos=1)
        print("Mensagem enviada ao broker:", payload)
        for x in range(2):
            sleep(0.1)
            p2.off()
            sleep(0.1)
            p2.on()
    finally:
        if err_count >= 3:
            reset()
        else:
            sleep(10)
