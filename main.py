from machine import Pin
import network
from time import sleep


ssid = "em"
key = "estacao-meteorlogica"

p2 = Pin(2, Pin.OUT)

wlan = network.WLAN()
wlan.active(True)
wlan.connect(ssid, key)

sleep(3)
if wlan.isconnected():
    p2.on()
