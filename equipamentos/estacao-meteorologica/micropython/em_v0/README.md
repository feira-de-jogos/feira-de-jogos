# Estação Meteorológica baseada em MicroPython e NodeMCU ESP32

- No projeto será utilizado um NodeMCU ESP32 em conjunto da linguagem [MicroPython](http://micropython.org/) para programação do dispositivo. Para obtenção dos dados, serão utilizados os respectivos sensores para cada informação meteorológica exigida.

## Andamento do projeto

Sensores instalados:

1. **Sensor DHT11:** O sensor está conectado na GPIO 23 da ESP32 e fornece leituras de temperatura e umidade. O módulo utilizado é integrado à linguagem.
1. **Sensor BME280:** O sensor usa o protocolo serial I2C para comunicação com a ESP32, está conectado nas GPIOs 22 (SCL) e 21 (SDA). Ele opera medindo temperatura, umidade e pressão. O módulo utilizado pode ser encontrado [aqui](https://github.com/kevbu/micropython-bme280/tree/master).
1. **Sensor MQ7:** Este sensor oferece 2 tipos de conexão: digital e análogica, como o projeto pretende obter valores, ele está conectado na GPIO 36 (Somente leitura, com ADC presente). Ele fornece a concentração de Monoxido de Carbono presente no ar em PPM (partículas por milhão). O módulo utilizado pode ser encontrado [aqui](https://github.com/kartun83/micropython-MQ/tree/master).
1. **RTC DS3231:** Este módulo também utiliza I2C para comunicação com a ESP32, está conectado nas GPIOs 5 (SCL) e 4 (SDA). Ele opera como um relógio em tempo real, marcando o tempo mesmo se a ESP32 fique sem energia usando uma bateria CR2032. O módulo utilizado pode ser encontrado [aqui](https://github.com/pangopi/micropython-DS3231-AT24C32).
1. **Sensor DS18B20:** Este sensor utiliza o protocolo OneWire para comunicação com a ESP32, enviando os dados coletador de forma digital. Ele está conectado na GPIO 2 da ESP32. Ele é capaz de medir temperaturas entre -55°C e 125°C com precisão informada de 0,5°C. O módulo utilizado é integrado à linguagem MicroPython.
1. **Sensor MQ4:** Este sensor foi instalado usando a porta análogica, ele está conectado na GPIO 39 (Somente leitura, com ADC presente). Ele fornece a concentração de Gás Metano presente no ar em PPM (partículas por milhão). O módulo utilizado pode ser encontrado [aqui](https://github.com/kartun83/micropython-MQ/tree/master)
1. **Sensor de pingos de chuva:** Foi instalado na GPIO 34 (Somente leitura, com ADC presente) usando a conexão analógica.
1. **Módulo GPS NEO-6M:** Foi instalado nas GPIOs 12 e 13, utilizando interface serial para envio dos dados de GPS. O hardware pode apresentar algumas distorções nos dados caso não esteja nas condições ideais (Ambiente aberto, céu limpo, baixa interferência).


- A leitura do RTC é transformada em formato timestamp UNIX 
- As leituras destes sensores são obtidas a cada 60~120 segundos.

#### Modelo de dados:
Este é o modelo usado para tramissão dos dados:
* O modelo segue o padrão [Line protocol](https://docs.influxdata.com/influxdb/v2/reference/syntax/line-protocol/) da Influxdata.

**Tags:**
| Ordem | Tag| Descrição|
|-|-|-|
| 1º|`v`|Versão da estação meteorológica|
| 2º| `lat`|Latitude da estação meteorológica|
| 3º| `lng`|Longitude da estação meteorológica|
| 4º| `alt`|Altitude da estação meteorológica|


**Variáveis:**
| Ordem | Variável| Unidade| Descrição|
|-|-|-|-|
| 1º| `dht11_temp`| °C| Temperatura ambiente medida pelo sensor DHT11|
| 2º| `dht11_umid`| %| Umidade relativa do ar medida pelo sensor DHT11|
| 3º| `bme280_temp`| °C| Temperatura ambiente medida pelo sensor BME280|
| 4º| `bme280_umid`| %| Umidade relativa do ar medida pelo sensor BME280|
| 5º| `bme280_press`| hPa| Pressão atmosférica medida pelo sensor BME280|
| 6º| `ds18b20_temp`| °C| Temperatura medida pelo sensor DS18B20|
| 7º| `mq7_co`| ppm| Concentração de monóxido de carbono (CO) detectada  |
| 8º| `mq4_ch4`| ppm| Concentração de metano, Gás Natural ou GLP detectada   |
| 9º| `sensor_chuva`| sem unidade |Detecção de água no sensor de chuva|
|X|`timestamp`|ns|Timestamp UNIX em ns medindo o tempo no momento da leitura|

- Os dados estão sendo enviados via MQTT para o broker da feira de jogos.
- A versão 0 já está pronta e rodando.
- O GPS instalado fornece dados de altitude, longitude e latitude **que não são totalmente confiáveis**.
- Os dados sensíveis marcados no código com `dotenv.` são armazenados no arquivo `config.env`.
- Para identificação das mensagens enviadas e das estações ativas será usado o sistema de `UUIDs`, o [arquivo](./uuids_v0.md) contém os IDs.


***O código atualizado pode ser encontrado na pasta da estação junto dos módulos utilizados.***
