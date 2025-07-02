from machine import Pin, I2C
from time import sleep
from libs import bmp280
import dht

led = Pin(2, Pin.OUT)
led.on()
sleep(1)
led.off()

dados = {}

i2c0 = I2C(scl=Pin(23), sda=Pin(22))
bmp_280 = bmp280.BMP280(i2c0)
dht22 = dht.DHT22(Pin(13))


while True:

    dados['temp.bmp280'] = bmp_280.get_temperature()
    dados['press.bmp280'] = bmp_280.get_pressure() / 100
    dht22.measure()
    sleep(2)
    dados['temp.dht22'] = dht22.temperature()
    dados['umid.dht22'] = dht22.humidity()
    for i in dados:
        print(i + ': ' + str(dados[i]))
    print('')
    sleep(1)
