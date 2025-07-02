# Sensores

### Temperatura Ambiente:

Os principais sensores do mercado para esta aplicação utilizando a plataforma selecionada são:

Analógicos: LM35 (LM335 / LM34), DHT11/DHT22, TMP36
Digitais: DS18B20, BME280, Termopares

### Pressão Atmosférica:

BMP180
BMP280
BME280

### Umidade Relativa:

BME280
Dht11/Dht22

### Direção e Velocidade do Vento:


### Contaminação do Ar:

Principais Especificações:

Modelo: Sensor MQ-2 | Detecção de gases inflamáveis: (disponível)

-   GLP, Metano, Propano, Butano, Hidrogênio
    

Modelo: Sensor MQ-3 | Detecção de gases:

-   Álcool e Etanol
    

Modelo: Sensor MQ-4 | Detecção de gases:

-   Metano, Propano e Butano.
    

Modelo: Sensor MQ-5 | 5VDC | Detecção de gases: (disponível)

-   Alta sensibilidade para gases GLP e GN
    
-   Baixa sensibilidade para álcool e fumaça
    

Modelo: Sensor MQ-6 | Detecção de gases:

-   Alta sensibilidade para GLP, isobutano e propano
    
-   Baixa sensibilidade para álcool e fumaça
    

Modelo: Sensor MQ-7 | Detecção de gases: (disponível)

-   Detecção de gases: Monóxido de Carbono.
    

Modelo: Sensor MQ-8 | Detecção de gases:

-   Alta sensibilidade para Hidrogênio (H2)
    
-   Baixa sensibilidade para gás de cozinha, álcool e fumaça
    

Modelo: Sensor MQ-9 | Detecção de gases:

-   Monóxido de Carbono, metano e propano.
    

Modelo: Sensor MQ-135 | 5VDC | Detecção de gases tóxicos como :

-   amônia, dióxido de carbono, benzeno, óxido nítrico, fumaça e álcool
    
    
De <[https://www.casadarobotica.com/sensores-modulos/sensores/gas/kit-sensor-de-gas-mq-2-mq-3-mq-4-mq-5-mq-6-mq-7-mq-8-mq-9-mq-135?srsltid=AfmBOool0bjDRgMQ_yFPso5MKlgcn-TQHHKN2YnjJ_ur4rDOg6tj1__c](https://www.casadarobotica.com/sensores-modulos/sensores/gas/kit-sensor-de-gas-mq-2-mq-3-mq-4-mq-5-mq-6-mq-7-mq-8-mq-9-mq-135?srsltid=AfmBOool0bjDRgMQ_yFPso5MKlgcn-TQHHKN2YnjJ_ur4rDOg6tj1__c)>

### Qualidade do Ar:
- MQ2 Gases inflamáveis (GLP/Butano/Propano) de 300 a 10000ppm
- MQ3 Gases inflamáveis (Álcool/Etanol) de 10 a 10000ppm
- MQ4 Gases inflamáveis (CH4 e GN) de 300 a 10000ppm
- MQ5 Gases de (Carvão, GLP e GN) de 200 a 10000ppm
- MQ6 Gases (GLP, Propano e isobutano) de 300 a 10000ppm
- MQ7 Monóxido de Carbono (CO) de 10 a 1000ppm
- MQ8 Gás Hidrogênio (H2) de 100 a 10000ppm
- MQ9  Gases CO, CH4, Propano | 10 a 1000 (CO) e 100 a 10000 outros
- MQ135 Gases tóxicos (Amônia, Óxido Nítrico, Álcool, Benzeno, CO2 e Fumaça) de 10 a 1000ppm

### Radiação Solar:

LDR para iluminação solar.

### Latitude, Longitude e Altitude:
Módulo GPS NEO-6M com Antena

De <[https://www.eletrogate.com/modulo-gps-neo-6m-com-antena?srsltid=AfmBOooRrgneNdrMmGDnYCNhQ1o0o7G1uzJBbEBC1dmgxN4DcOGXm5v1](https://www.eletrogate.com/modulo-gps-neo-6m-com-antena?srsltid=AfmBOooRrgneNdrMmGDnYCNhQ1o0o7G1uzJBbEBC1dmgxN4DcOGXm5v1)>


### Real Time Clock:
Real Time Clock RTC DS3231

De <	[https://www.eletrogate.com/real-time-clock-rtc-ds3231](https://www.eletrogate.com/real-time-clock-rtc-ds3231)>

Interessante por contar com um sensor de temperatura interno e um oscilador para melhorar a exatidão da medida. Capaz de fornecer formato 12h e 24h e apresentar segundos, minutos, horas dia via protocolo I2C.

### Modelo de Dados: 

DATA: Timestamp
HORA: Timestamp

| Variável | Tipo    | Faixa        | Unidade | Sensibilidade                      |
|----------|---------|--------------|---------|------------------------------------|
| MQ2G     | inteiro | 300 a 10.000 | ppm     | Fumaça (GLP/Butano/Propano)        |
| MQ4G     | inteiro | 300 a 10.000 | ppm     | Metano / GN                        |
| MQ5G     | inteiro | 200 a 10.000 | ppm     | Fumaça (Carvão/GLP/GN)             |
| MQ7G     | inteiro | 10 a 1.000   | ppm     | Monóxido de Carbono                |
| MQ8G     | inteiro | 100 a 10.000 | ppm     | Hidrogênio                         |
| MQ135    | inteiro | 10 a 1.000   | ppm     | Gases tóxicos                      |
