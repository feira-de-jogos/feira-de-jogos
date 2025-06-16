import dht, time
from libs import BME280, ds3231, MQ7
from machine import Pin, I2C, ADC

i2c0 = I2C(0, scl=Pin(22), sda=Pin(21), freq=10000)
i2c1 = I2C(1, sda=Pin(4), scl=Pin(5))

dht11 = dht.DHT11(Pin(23))
bme = BME280.BME280(i2c=i2c0)
ds = ds3231.DS3231(i2c=i2c1)

mq7 = MQ7.MQ7(pinData=36)
mq7.calibrate()
print("CALIBRADO")

while True:
    dht11.measure()
    temp = dht11.temperature()
    hum = dht11.humidity()
    
    temp1 = bme.temperature()
    hum1 = bme.humidity()
    pres1 = bme.pressure()
        
    year, month, day, weekday, hour, minute, second, _ = ds.datetime()
    
    co = mq7.readCarbonMonoxide()
    
    print(co)
    print("Em ",day,"/",month,"/", year," às ",hour,":",minute," A Temperatura e Umidade no DHT11 eram: ",temp,"°C, ", hum,"%")
    print("Em ",day,"/",month,"/", year," às ",hour,":",minute," A Temperatura, Pressão e Umidade no BME280 eram: ",temp1,"°C, ",hum1,"% e ",pres1,"hPa")
    time.sleep(1)