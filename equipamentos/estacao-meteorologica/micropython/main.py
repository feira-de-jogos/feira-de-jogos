import dht, time, onewire, ds18x20
from libs import BME280, ds3231, MQ7
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

mq7 = MQ7.MQ7(pinData=36)
#time.sleep(180)
#tempo acima serve para aquecer o sensor, descomentar quando for aplicado na prática.
mq7.calibrate()


while True:
    start = time.time()

    dht11.measure()
    dados["temp.dht11"] = dht11.temperature()
    dados["hum.dht11"] = dht11.humidity()
    
    dados["temp.bme280"] = bme280.temperature()
    dados["hum.bme280"] = bme280.humidity()
    dados["press.bme280"] = bme280.pressure()
    
    ds18x20.convert_temp()
    time.sleep(0.75)
    dados["temp.ds18x20"] = ds18x20.read_temp(roms[0])
        
    dados["co.mq7"] = mq7.readCarbonMonoxide()
    
    execution_time = time.time() - start 
    year, month, day, weekday, hour, minute, second, _ = ds3231.datetime()
    
    print("Em ",day,"/",month,"/", year," às ",hour,":",minute,"\n A Temperatura no DS18B20 era: ",dados["temp.ds18x20"],"°C \n A concentração de Monóxido de Carbono era: ",dados["co.mq7"],"ppm \n A Temperatura e Umidade no DHT11 eram: ",dados["temp.dht11"],"°C, ", dados["hum.dht11"],"% \n A Temperatura, Pressão e Umidade no BME280 eram: ",dados["temp.bme280"],"°C, ",dados["hum.bme280"],"% e ",dados["press.bme280"],"hPa")
    
    if execution_time < 60:
        time.sleep(60 - execution_time)
    else:
        print("Tempo de execução excedido")
