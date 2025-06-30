import dht, onewire, ds18x20
from libs import BME280, ds3231, MQ7, MQ4
from time import sleep, time, mktime
from machine import Pin, I2C, ADC

i2c0 = I2C(0, scl=Pin(22), sda=Pin(21), freq=10000)
i2c1 = I2C(1, sda=Pin(4), scl=Pin(5))

data_ds18x20 = Pin(2)
ow = onewire.OneWire(data_ds18x20)
ds18x20 = ds18x20.DS18X20(ow)
roms = ds18x20.scan()

dados = {}

dht11 = dht.DHT11(Pin(23))
bme280 = BME280.BME280(i2c=i2c0)
ds3231 = ds3231.DS3231(i2c=i2c1)
rain = ADC(34)


mq4 = MQ4.MQ4(pinData=39)
mq4.calibrate()

mq7 = MQ7.MQ7(pinData=36)
mq7.calibrate()

sleep(180)
print('Calibrado e funcionando')

def timestamp():
    x = ds3231.datetime()
    diference = 946684800  
    timestamp = mktime((x[0], x[1], x[2], x[4], x[5], x[6], 0, 0)) + diference
    ts_ns = timestamp * 10**9
    return ts_ns

def formatar(ts_ns):
    data = ''
    data += 'estaçao_v0'
    data += ' '
    data += 'dht11_temp=' + str(dados['temp.dht11']) + ','
    data += 'dht11_umid=' + str(dados['umid.dht11']) + ','
    data += 'bme280_temp=' + str(dados['temp.bme280']) + ','
    data += 'bme280_umid=' + str(dados['umid.bme280']) + ','
    data += 'bme280_press=' + str(dados['press.bme280']) + ','
    data += 'ds18b20_temp=' + str(dados['temp.ds18b20']) + ','
    data += 'mq7_co=' + str(dados['co.mq7']) + ','
    data += 'mq4_gi=' + str(dados['gi.mq4']) + ','
    data += 'sensor_chuva=' + str(dados['valor_chuva'])
    data += ' ' + str(ts_ns)

    return data

while True:
    inicio = time()

    dht11.measure()
    dados["temp.dht11"] = dht11.temperature()
    dados["umid.dht11"] = dht11.humidity()
    
    dados["temp.bme280"] = bme280.temperature()
    dados["umid.bme280"] = bme280.humidity()
    dados["press.bme280"] = bme280.pressure()
    
    ds18x20.convert_temp()
    sleep(0.75)
    dados["temp.ds18b20"] = ds18x20.read_temp(roms[0])
        
    dados["co.mq7"] = mq7.readCarbonMonoxide()
    dados['gi.mq4'] = mq4.readMethane()
    
    dados['valor_chuva'] = rain.read()
    
    tempo_execucao = time() - inicio 
    ts_ns = timestamp() 
    
    data = formatar(ts_ns)
    print(data)
    
    if tempo_execucao < 60:
        sleep(60 - tempo_execucao)
    else:
        print('Tempo de execução excedido: ' + str(tempo_execucao))
