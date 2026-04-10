import network, utime, ntptime
from umqtt.robust import MQTTClient
import bmp280, aht10
from time import sleep, time, mktime
from machine import Pin, I2C, ADC, SPI

i2c0 = I2C(0, sda=Pin(21), scl=Pin(22))

ssid = 'internet'
senha = '12345678'

def conecta_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        wlan.connect(ssid, senha)
        while not wlan.isconnected():
            sleep(0.5)
            print('CONECTANDO')
        print("Wi-Fi conectado:", wlan.ifconfig())

dados = {}
uuid = '01a0f0bb-a239-49a9-9f51-56dfdcbca317'
topico_data = 'em/'
v = '0'
lat = '0.0'
lng = '0.0'
alt = '0.0'


print(i2c0.scan())

bmp280 = bmp280.BMP280(i2c0)
aht10 = aht10.AHT10(i2c0)

conecta_wifi()
client = MQTTClient(topico_data + uuid,'mqtt.feira-de-jogos.dev.br', port=1883)
client.connect()


while True:
    dados['temp.bmp280'] = bmp280.get_temperature()
    dados['press.bmp280'] = bmp280.get_pressure() / 100
    
    dados['temp.aht10'] = aht10.temperature
    dados['umid.aht10'] = aht10.relative_humidity
    
    #temporario (timestamp)
    ntptime.settime()
    time = utime.time() + 946684800
    ts_ns = time * 10**9
    print(ts_ns)
    
    msg = ''
    msg += topico_data
    msg += uuid + ','
    msg += 'v=' + v + ','
    msg += 'lat=' + lat + ','
    msg += 'lng=' + lng + ','
    msg += 'alt=' + alt
    msg += ' '
    msg += 'temp.bmp280=' + str(dados['temp.bmp280']) + ','
    msg += 'umid.aht10=' + str(dados['umid.aht10']) + ','
    msg += 'press.bmp280=' + str(dados['press.bmp280'])
    msg += ' '
    msg += str(ts_ns)
    

    
    print(msg)
    try:
        client.publish(topico_data + uuid, msg, qos=1)
    except Exception as e:
        print(e)
    

    print(dados)
    sleep(60)
