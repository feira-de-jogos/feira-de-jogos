from machine import Pin
import network
from time import sleep
import mip


ssid = "em"
key = "estacao-meteorologica"

p2 = Pin(2, Pin.OUT)

wlan = network.WLAN()
wlan.active(True)
wlan.connect(ssid, key)

sleep(3)
if wlan.isconnected():
    p2.on()
    mip.install("umqtt.simple")    
