import dotenv
import ntp
from machine import Pin
import network
import umqtt.simple


dotenv.load_env()

p2 = Pin(2, Pin.OUT)
wlan = network.WLAN()
mqtt_client = umqtt.simple.MQTTClient(
    client_id=dotenv.MQTT_CLIENT_ID, server=dotenv.MQTT_BROKER
)

if wlan.isconnected():
    mqtt_client.connect()
    print("Conectado no broker MQTT!")

    time = ntp.time()
    print("Hora atual:", time)
    ntp.settime()
    mqtt_client.publish("em/" + dotenv.MQTT_CLIENT_ID, str(time))
    print("Mensagem enviada ao broker!")

    p2.on()

else:
    print("Sem conexão WiFi.")
