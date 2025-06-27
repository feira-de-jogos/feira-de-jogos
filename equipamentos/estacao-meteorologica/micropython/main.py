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


def timestamp():
    x = ds3231.datetime()
    diference = 946684800  
    timestamp = mktime((x[0], x[1], x[2], x[4], x[5], x[6], 0, 0)) + diference
    ts_ns = timestamp * 10**9
    return ts_ns

mq4 = MQ4.MQ4(pinData=39)
mq4.calibrate()

mq7 = MQ7.MQ7(pinData=36)
#sleep(180)
#tempo acima serve para aquecer o sensor, descomentar quando for aplicado na prática.
mq7.calibrate()


while True:
    start = time()

    dht11.measure()
    dados["temp.dht11"] = dht11.temperature()
    dados["hum.dht11"] = dht11.humidity()
    
    dados["temp.bme280"] = bme280.temperature()
    dados["hum.bme280"] = bme280.humidity()
    dados["press.bme280"] = bme280.pressure()
    
    ds18x20.convert_temp()
    sleep(0.75)
    dados["temp.ds18x20"] = ds18x20.read_temp(roms[0])
        
    dados["co.mq7"] = mq7.readCarbonMonoxide()
    dados['ch4.mq4'] = mq4.readMethane()
    
    dados['rain_value'] = rain.read()
    
    execution_time = time() - start 
    ts = timestamp() 
    
    
    print('Em:', ts)
    print('- A Temperatura no DS18B20 era: ' + str(dados["temp.ds18x20"]) + ' °C')
    print('- A concentração de Monóxido de Carbono no MQ7 era: ' + str(dados["co.mq7"]) + 'ppm')
    print('- A Temperatura e Umidade no DHT11 eram: ' + str(dados["temp.dht11"]) + '°C, ' +  str(dados["hum.dht11"]) + '%')
    print('- A Temperatura, Pressão e Umidade no BME280 eram: ' + str(dados["temp.bme280"]) + '°C, ' + str(dados["hum.bme280"]) + '% e ' + str(dados["press.bme280"]) + 'hPa')
    print('- A concentração de gás metano no MQ4 era: ' + str(dados['ch4.mq4']) + 'ppm')
    print('- A leitura no sensor de chuva era: ' + str(dados['rain_value']))
    
    
    
    if execution_time < 60:
        sleep(60 - execution_time)
    else:
        print("Tempo de execução excedido")
