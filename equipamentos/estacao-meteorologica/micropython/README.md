# Estação Meteorológica baseada em MicroPython e NodeMCU ESP32

- No projeto será utilizado um NodeMCU ESP32 em conjunto da linguagem [MicroPython](http://micropython.org/) para programação do dispositivo. Para obtenção dos dados, serão utilizados os respectivos sensores para cada informação meteorológica exigida.

## Andamento do projeto

Até o momento, estão em operação os sensores DHT11, BME280, MQ7 e DS18B20, além do módulo DS3231. 

1. **Sensor DHT11:** O sensor está conectado na GPIO 23 da ESP32 e fornece leituras de temperatura e umidade. O módulo utilizado é integrado à linguagem.
1. **Sensor BME280:** O sensor usa o protocolo serial I2C para comunicação com a ESP32, está conectado nas GPIOs 22 (SCL) e 21 (SDA). Ele opera medindo temperatura, umidade e pressão. O módulo utilizado pode ser encontrado [aqui](https://github.com/kevbu/micropython-bme280/tree/master).
1. **Sensor MQ7:** Este sensor oferece 2 tipos de conexão: digital e análogica, como o projeto pretende obter valores, ele está conectado na GPIO 36 (Somente leitura, com ADC presente). Ele fornece a concentração de Monoxido de Carbono presente no ar em PPM (partículas por milhão). O módulo utilizado pode ser encontrado [aqui](https://github.com/kartun83/micropython-MQ/tree/master).
1. **Módulo DS3231:** Este módulo também utiliza I2C para comunicação com a ESP32, está conectado nas GPIOs 5 (SCL) e 4 (SDA). Ele opera como um relógio em tempo real, marcando o tempo mesmo se a ESP32 fique sem energia usando uma bateria CR2032. O módulo utilizado pode ser encontrado [aqui](https://github.com/pangopi/micropython-DS3231-AT24C32).
1. **Sensor DS18B20:** Este sensor utiliza o protocolo OneWire para comunicação com a ESP32, enviando os dados coletador de forma digital. Ele está conectado na GPIO 2 da ESP32. Ele é capaz de medir temperaturas entre -55°C e 125°C com precisão informada de 0,5°C. O módulo utilizado é integrado à linguagem MicroPython.

- As leituras destes sensores são obtidas a cada 60 segundos.

##### O código atualizado pode ser encontrado na pasta da estação junto dos módulos utilizados.
##### Atualizado em 17/06/2025 às 12:51
