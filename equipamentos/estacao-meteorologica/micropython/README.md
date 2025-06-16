# Estação Meteorológica baseada em MicroPython e NodeMCU ESP32

- No projeto será utilizado um NodeMCU ESP32 em conjunto da linguagem [MicroPython](http://micropython.org/) para programação do dispositivo. Para obtenção dos dados, serão utilizados os respectivos sensores para cada informação meteorológica exigida.

## Andamento do projeto

Até o momento, estão em operação os sensores DHT11, BME280, e MQ7, além do módulo DS3231. 

1. **Sensor DHT11:** O sensor está conectado na GPIO 23 da ESP32 e fornece leituras de temperatura e umidade. O módulo utilizado é integrado à linguagem.
1. **Sensor BME280:** O sensor usa o protocolo serial I2C para comunicação com a ESP32, está conectado nas GPIOs 22 (SCL) e 21 (SDA). Ele opera medindo temperatura, umidade e pressão. O módulo utilizado pode ser encontrado [aqui](https://github.com/kevbu/micropython-bme280/tree/master).
1. **Sensor MQ7:** Este sensor oferece 2 tipos de conexão: digital e análogica, como o projeto pretende obter valores, ele está conectado na GPIO 36 (Somente leitura, com ADC presente). Ele fornece a concentração de Monoxido de Carbono presente no ar em PPM (partículas por milhão). O módulo utilizado pode ser encontrado [aqui](https://github.com/kartun83/micropython-MQ/tree/master).
1. **Módulo DS3231:** Este módulo também utiliza I2C para comunicação com a ESP32, está conectado nas GPIOs 5 (SCL) e 4 (SDA). Ele opera como um relógio em tempo real, marcando o tempo mesmo se a ESP32 fique sem energia usando uma bateria CR2032. O módulo utilizado pode ser encontrado [aqui](https://github.com/pangopi/micropython-DS3231-AT24C32).

##### Código utilizado até o momento:


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



##### Atualizado em 16/06/2025 às 13:10
