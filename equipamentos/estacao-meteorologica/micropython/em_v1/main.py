from machine import Pin, I2C, SPI, ADC
from umqtt.robust import MQTTClient
from time import sleep, mktime, sleep_ms
from libs import ahtx0, sdcard, bme280, bmp280, ds3231, mcp9808, bmp180, bmp388, lm75a, ads1x15, aht25
import dht, os, network, ds18x20, onewire

led = Pin(2, Pin.OUT)
led.on()
sleep(1)
led.off()

uuid = '88a2e875-30a9-49b5-ab15-4a185eaa85e3'
topico_data = 'em/' + uuid 
SSID = 'INTERNET'
PASSWORD = '33467840'
versao_em = 1

latitude = '-27.55256'
altitude = '37.2'
longitude = '-48.62854'


dados = {}

i2c0 = I2C(0, scl=Pin(22), sda=Pin(21))
i2c1 = I2C(1, scl=Pin(26), sda=Pin(25))

print("Dispositivos I2C0 encontrados:", i2c0.scan())
print("I2C1 encontrados:", i2c1.scan())

ds18x20 = ds18x20.DS18X20(onewire.OneWire(Pin(15)))
sleep_ms(200)
roms = ds18x20.scan()
print(roms)
aht10 = ahtx0.AHT10(i2c0, 56)
aht25 = aht25.AHT25(i2c1)
mcp9808 = mcp9808.MCP9808(i2c0)
mcp9808.set_resolution(3)
bmp180 = bmp180.BMP180(i2c=i2c0)
bmp180.oversample_sett = 3
bmp280 = bmp280.BMP280(i2c=i2c1, i2c_address=118)
bme280 = bme280.BME280(i2c=i2c0, addr=118)
bmp388 = bmp388.DFRobot_BMP388_I2C(i2c1)
ds3231 = ds3231.DS3231(i2c0)
dht22 = dht.DHT22(Pin(27))
dht11 = dht.DHT11(Pin(0))
lm75 = lm75a.LM75A(i2c=i2c0)
adc = ads1x15.ADS1115(i2c1, address=72, gain=0)

def timestamp():
    x = ds3231.datetime()
    diference = 946684800  
    timestamp = mktime((x[0], x[1], x[2], x[4], x[5], x[6], 0, 0)) + diference
    ts_ns = timestamp * 10**9
    return ts_ns

def ds18b20_ler():
    try:
        ds18x20.convert_temp()
        sleep(1)
        temp = ds18x20.read_temp(roms[0])
        return temp
    except Exception as e:
        msg_erro = 'Erro na leitura do DS18B20: ' + str(e)
        try:
            client.publish('em/debug', msg_erro)
        except:
            print('erro mqtt debug ds18b20')
        print(msg_erro)
        return 0.0

def ler_lm35dz():
    valor = adc.read(0, 0)
    tensao = (6.144 * valor) / 32768
    temp = tensao / 0.01
    return temp

def conecta_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            sleep(0.5)
            print('CONECTANDO')
        print("Wi-Fi conectado:", wlan.ifconfig())
try:
    AHT25_RH, dados['temp.aht25'], AHT25_status, AHT25_CRC = aht25.read_sensor()
except Exception as e:
    print('erro aht25', e)
sleep(0.05)
    
try:
    dados["temp.bme280"] = bme280.temperature()
except Exception as e:
    print('erro bme280', e)
    dados["temp.bme280"] = 0.0
sleep(0.05)
        
conecta_wifi()
client = MQTTClient(topico_data,'feira-de-jogos.dev.br', port=1883)
client.connect()

while True:
    
    dados["temp.bmp280"] = bmp280.get_temperature()
    
    try:
        dados["temp.bme280"] = bme280.temperature()
    except Exception as e:
        print('erro bme280', e)
    sleep(0.05)
    
    try:
        dados['temp.bmp388'] = bmp388.readTemperature()
    except Exception as e:
        print('erro bmp388', e)
    sleep(0.05)
    
    try:
        dados['temp.aht10'] = aht10.temperature
    except Exception as e:
        print('erro aht10', e)
    sleep(0.05)
    
    try:
        dados['temp.mcp9808'] = mcp9808.get_temp()
    except Exception as e:
        print('erro mcp9808', e)
    sleep(0.05)
    
    try:
        dados['temp.bmp180'] = bmp180.temperature
    except Exception as e:
        print('erro bmp180', e)
    sleep(0.05)
    
    try:
        dados['temp.lm75'] = lm75.temp()
    except Exception as e:
        print('erro lm75', e)
    sleep(0.05)
    
    try:
        AHT25_RH, dados['temp.aht25'], AHT25_status, AHT25_CRC = aht25.read_sensor()
    except Exception as e:
        print('erro aht25', e)
    sleep(0.05)

    dados['temp.lm35dz'] = ler_lm35dz()
    
    dados['temp.ds18b20'] = ds18b20_ler() 
    
    dht22.measure()
    sleep(1)
    dados['temp.dht22'] = dht22.temperature()
    
    dht11.measure()
    sleep(3)
    dados['temp.dht11'] = dht11.temperature()
    
    ts = timestamp()
    print(ts)
    
    data = ''
    data += topico_data + ','
    data += 'v=' + str(versao_em) + ','
    data += 'lat=' + str(latitude) + ','
    data += 'lng=' + str(longitude) + ','
    data += 'alt=' + str(altitude)
    data += ' '
    
    data += 'temp.bmp280=' + str(dados['temp.bmp280']) + ','
    
    data += 'temp.bme280=' + str(dados['temp.bme280']) + ','
    
    data += 'temp.bmp388=' + str(dados['temp.bmp388']) + ','
    
    data += 'temp.bmp180=' + str(dados['temp.bmp180']) + ','
    
    data += 'temp.aht10=' + str(dados['temp.aht10']) + ','
    
    data += 'temp.aht25=' + str(dados['temp.aht25']) + ','
    
    data += 'temp.lm35dz=' + str(dados['temp.lm35dz']) + ','
    
    data += 'temp.lm75=' + str(dados['temp.lm75']) + ','

    data += 'temp.mcp9808=' + str(dados['temp.mcp9808']) + ','
    
    data += 'temp.ds18b20=' + str(dados['temp.ds18b20']) + ','
    
    data += 'temp.dht22=' + str(dados['temp.dht22']) + ','
    
    data += 'temp.dht11=' + str(dados['temp.dht11'])
    
    data += ' ' + str(ts)
    
    try:
        client.publish(topico_data, data, qos=1)
    except Exception as e:
        print(e)
    
    print(data)
    sleep(30)




