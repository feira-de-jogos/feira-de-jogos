import dotenv
from machine import Pin
import network
import umqtt.simple

p2 = Pin(2, Pin.OUT)

wlan = network.WLAN()
mqtt_client = umqtt.simple.MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER)
if wlan.isconnected():
    if mqtt_client.connect():
        mqtt_client.publish("em/" + MQTT_CLIENT_ID, "1")
        p2.on()
