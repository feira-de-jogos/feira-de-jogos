from machine import Pin
import network

p2 = Pin(2, Pin.OUT)

wlan = network.WLAN()
if wlan.isconnected():
    p2.on()
