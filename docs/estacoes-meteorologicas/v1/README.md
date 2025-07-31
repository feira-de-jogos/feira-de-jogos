# Versão 1

Objetivos:

- Aprimorar a versão 0 com sensores melhores para garantir mais qualidade e confiabilidade dos dados coletados.
- Adicionar os sensores requisitados que não foram instalados na v0.

## Bibliotecas utilizadas para os testes

[SD](https://github.com/avovk1/micropython_sdcard/blob/main/sdcard.py)
[ATHx0](https://github.com/targetblank/micropython_ahtx0/blob/master/ahtx0.py)
[BMP280](https://github.com/PaszaVonPomiot/micropython-driver-bmp280)

## Tabelas Comparativas

## Temperatura

| Sensor        | Faixa (°C) | Precisão (typ./máx.) | Resolução         | Deriva Longo Prazo | Encapsulamento                | Consumo Standby | Consumo Ativo  | Interface         | Tempo de Resposta     | Valor para compra                                                                                                                                                                              |
| ---------- | ---------- | -------------------- | ----------------- | ------------------ | ----------------------------- | --------------- | -------------- | ----------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SHT31-DIS** | -40 a 125  | ±0,2°C / ±0,7°C      | 0,01°C            | < 0,03°C/ano       | DFN (open-cavity)             | 0,2µA / 6µA     | 600µA / 1.5mA  | I2C (1 MHz)       | ~4 s (1/e 63%)        | [~27,74R$](https://br.mouser.com/ProductDetail/Sensirion/SHT31-DIS-F25kS?qs=SiS427jF8nOsxbyIRpupXg%3D%3D&mgh=1)                                                                                 |
| **SHT35-DIS** | -40 a 125  | ±0,1°C / ±036°C      | 0,01°C            | < 0,03°C/ano       | DFN (open-cavity)             | 0,2µA / 6µA     | 600µA / 1,5mA  | I2C (1 MHz)       | ~ 4s (1/e 63%)        | [~48,69R$](https://www.digikey.com.br/pt/products/detail/sensirion-ag/SHT35-DIS-F2-5KS/6212135)                                                                                                 |
| **SHT85**     | -40 a 105  | ±0,1°C / ±0,6°C      | 0,01°C            | < 0,03°C/ano       | IP67 + membrana               | 0,2µA / 12µA    | 600µA / 1.5mA  | I2C (1 MHz)       | ~ 4s (1/e 63%)        | [167,98R$](https://produto.mercadolivre.com.br/MLB-4632007668-modulo-de-sensor-de-temperatura-e-umidade-sht85-sht-85-dip4-_JM?matt_tool=18956390&utm_source=google_shopping&utm_medium=organic) |
| **LM75**      | -55 a 125  | ±2,0°C / ±3,0°C      | 9 bits            | —                  | SOP-8 / MSOP-8                | 4µA / 6µA       | 250µA / 1mA    | I2C (100 kHz)     | ~100 ms conversão     | [17,61R$](https://www.usinainfo.com.br/sensor-de-temperatura/sensor-de-temperatura-lm75a-i2c-de-alta-velocidade-8338.html)                                                                      |
| **DS18B20**   | -55 a 125  | ±0,5°C / ±2,0°C      | Até 0,0625°C      | —                  | TO-92 / SOIC-8 / prova d'água | 0,75µA / 1µA    | 1,0mA / 1,5mA  | 1-Wire            | ~750 ms (12 bits)     | [6,56R$](https://www.eletrogate.com/modulo-sensor-de-temperatura-lm75-i2c?utm_source=Site&utm_medium=GoogleMerchant&utm_campaign=GoogleMerchant)                                                |
| **LM35**      | -55 a 150  | ±0,4°C / ±1,5°C      | ~0.08°C (ADC 12b) | ±0,3°C / ±0,5°C    | TO-46 / TO-92 / TO-220        | —               | 56µA / 161µA   | Analógica         | Quase instantâneo     | [31,77R$](https://www.baudaeletronica.com.br/produto/sensor-de-temperatura-lm35-original.html?utm_source=Site&utm_medium=GoogleMerchant&utm_campaign=GoogleMerchant)                            |
| **LM35DZ**    | 0 a 100    | ±0,6°C / ±2,0°C      | ~0,08°C (ADC 12b) | ±0,2°,C / ±0,5°C    | TO-46 / TO-92 / TO-220        | —               | 56µA / 141µA   | Analógica         | Quase instantâneo     | [12,90R$](https://www.eletrogate.com/sensor-temperatura-lm35dz?utm_source=Site&utm_medium=GoogleMerchant&utm_campaign=GoogleMerchant)                                                           |
| **DHT11**     | 0 a 50     | ±1,0°C / ±2,0°C      | 1°C (8 bits)      | —                  | 4 pinos                       | 100µA / 150µA   | 0,5mA / 2,5mA  | Serial (~10 kbps) | 6 a 30s (1/e 63%)    | [7,22R$](https://www.makerhero.com/produto/sensor-de-umidade-e-temperatura-dht11/)                                                                                                              |
| **DHT22**     | -40 a 80   | < ±0,5°C              | 0,1°C             | —                  | 4 pinos                       | 40µA / 50µA     | 1,0mA / 1,5mA  | Serial (~8 kbps)  | ~ 2s                  | [20,90R$](https://www.eletrogate.com/sensor-de-umidade-e-temperatura-dht22-am2302?utm_source=Site&utm_medium=GoogleMerchant&utm_campaign=GoogleMerchant)                                        |
| **MCP9808**   | -40 a 125  | ±0,25°C / ±1,0°C     | Até 0,0625°C      | —                  | DFN / MSOP-8                  | 0,1µA / 2µA     | 200µA / 400µA  | I2C (400 kHz)     | 30–250 ms (dep. bits) | [52,90R$](https://www.eletrogate.com/modulo-sensor-de-temperatura-de-alta-precisao-mcp9808-i2c)                                                                                                 |
| **AHT25**     | -40 a 80   | ±0,3°C / ±2,0°C      | 0,01°C            | ±0,1°C/ano         | SMD 4 pinos                   | 250nA           | 980µA          | I2C (100 kHz)     | 5 a 30 s (1/e 63%)    | [21,90R$](https://www.eletrogate.com/sensor-de-temperatura-e-umidade-aht25)                                                                                                                     |
| **HTU21D**    | -40 a 125  | ±0,3°C / ±1,6°C      | Até 0,01°C        | —                  | DFN                           | 0,02µA / 0,14µA | 450µA / 500µA  | I2C (400 kHz)     | ~50 ms (res. máx.)    | [20,82R$](https://www.usinainfo.com.br/sensor-de-umidade-arduino/sensor-de-umidade-e-temperatura-htu21d-4817.html)                                                                              |
| **BMP280**    | -40 a 85   | ±0,5°C / ±1,0°C      | Até 0,0003°C      | —                  | LGA (metal-lid)               | 0,1µA / 0,3µA   | 720µA / 1,12mA | I2C / SPI         | 5,5–43,2 ms (modos)   | [5,60R$](https://www.makerhero.com/produto/sensor-de-pressao-e-temperatura-bmp280/?srsltid=AfmBOopCqoIFAp6BhPX3RC5JIYkg1dIOkYtuVFlLqpDHLyf-OjU2tPXUPXo)                                         |
| **BME280**    | -40 a 85   | ±0,5°C / ±1,5°C      | 0,01°C            | —                  | LGA (metal-lid)               | 0,1µA / 0,3µA   | 340–714µA      | I2C / SPI         | ~ 1,5 ms (I2C)         | [36,96R$](https://www.usinainfo.com.br/sensor-de-pressao-arduino/sensor-de-pressao-umidade-e-temperatura-bme280-de-alta-precisao-33v-4682.html)                                                 |
| **AHT10**     | -40 a 85   | ±0,3°C / ±1,75°C     | 0,01ºC            | < 0,04ºC/ano       | similar to QFN                | 0,25µA          | 25µA           | I2C (400kHz)      | 5 a 30s (1/e 63%)    | [13,98R$](https://www.usinainfo.com.br/sensor-de-temperatura/sensor-aht10-de-alta-precisao-para-medir-temperatura-e-umidade-5691.html)                                                          |

## Umidade

| Sensor        | Faixa (%) | Precisão (typ./máx.) | Resolução     | Deriva Longo Prazo | Encapsulamento    | Consumo Standby | Consumo Ativo      | Interface         | Tempo de Resposta   | Valor para compra                                                                                                                                                                               |
| ------------- | --------- | -------------------- | ------------- | ------------------ | ----------------- | --------------- | ------------------ | ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SHT31-DIS** | 0 a 100   | ±2,0% / ±3,0%        | 0,01%         | < 0,25%/ano        | DFN (open-cavity) | 0,2µA / 6µA     | 600µA / 1,5mA      | I2C (1 MHz)       | ~8s (1/e 63%)       | [~27,74R$](https://br.mouser.com/ProductDetail/Sensirion/SHT31-DIS-F25kS?qs=SiS427jF8nOsxbyIRpupXg%3D%3D&)                                                                                      |
| **SHT35-DIS** | 0 a 100   | ±1,5% / ±3,0%        | 0,01%         | < 0,25%/ano        | DFN (open-cavity) | 0,2µA / 6µA     | 600µA / 1,5mA      | I2C (1 MHz)       | ~8s (1/e 63%)       | [~48,69R$](https://www.digikey.com.br/pt/products/detail/sensirion-ag/SHT35-DIS-F2-5KS/6212135)                                                                                                 |
| **SHT85**     | 0 a 100   | ±1,5% / ±3,0%        | 0,01%         | < 0,25%/ano        | IP67 + membrana   | 0,2µA / 12µA    | 600µA / 1,5mA      | I2C (1 MHz)       | < 8s (1/e 63%)      | [167,98R$](https://produto.mercadolivre.com.br/MLB-4632007668-modulo-de-sensor-de-temperatura-e-umidade-sht85-sht-85-dip4-_JM?matt_tool=18956390&utm_source=google_shopping&utm_medium=organic) |
| **DHT11**     | 20 a 80   | ±4,0% / ±5,0%        | 1% (8 bits)   | ±1%/ano            | 4 pinos           | 100µA / 150µA   | 0.5mA / 2,5mA      | Serial (~10 kbps) | 6 a 30s (1/e 63%)   | [7,22R$](https://www.makerhero.com/produto/sensor-de-umidade-e-temperatura-dht11/)                                                                                                              |
| **DHT22**     | 0 a 100   | ±2,0% / ±5,0%        | 0,1%          | —                  | 4 pinos           | 40µA / 50µA     | 1.0mA / 1,5mA      | Serial (~8 kbps)  | ~2s                 | [20,90R$](https://www.eletrogate.com/sensor-de-umidade-e-temperatura-dht22-am2302?utm_source=Site&utm_medium=GoogleMerchant&utm_campaign=GoogleMerchant)                                        |
| **AHT25**     | 0 a 100   | ±2,0% / ±6,0%        | 0,024%        | < 1%/ano           | SMD 4 pinos       | 250nA           | 980µA              | I2C (100 kHz)     | 6 s (1/e 63%)       | [21,90R$](https://www.eletrogate.com/sensor-de-temperatura-e-umidade-aht25)                                                                                                                     |
| **HTU21D**    | 0 a 100   | ±2,0% / ±5,0%        | Até 0,04%     | < 1%/ano           | DFN               | 0,02µA / 0,14µA | 450µA / 500µA      | I2C (400 kHz)     | ~50 ms (res. máx.)  | [20,82R$](https://www.usinainfo.com.br/sensor-de-umidade-arduino/sensor-de-umidade-e-temperatura-htu21d-4817.html)                                                                              |
| **BME280**    | 0 a 100   | ±3,0% / ±3,5%        | Até 0,008%    | ±0,5%/ano          | LGA (metal-lid)   | 0,1µA / 0,3µA   | 340µA / 714µA      | I2C / SPI         | ~135 ms (I2C)       | [36,96R$](https://www.usinainfo.com.br/sensor-de-pressao-arduino/sensor-de-pressao-umidade-e-temperatura-bme280-de-alta-precisao-33v-4682.html)                                                 |
| **AHT10**     | 0 a 100   | ±2,0% / ±5,0%        | ±3,0% / ±3,5% | < 0,5%/ano         | similar to QFN    | 0,25µA          | 25µA               | I2C (400kHz)      | < 8s (1/e 63%)      | [13,98R$](https://www.usinainfo.com.br/sensor-de-temperatura/sensor-aht10-de-alta-precisao-para-medir-temperatura-e-umidade-5691.html)                                                          |
| **HIH-4031**  | 0 a 100   | ±3,5%                | ADC 12 bits   | ±1.2%/ano          | SMD               | —               | 200µA / 500µA      | Analógica         | 5s (1/e 63%)        | [~570,96R$](https://br.mouser.com/ProductDetail/Honeywell/HIH-4031-003?qs=yJVtgANCw03sE9P%2FDzBvRA%3D%3D)                                                                                       |
| **HR202L**     | 20 a 95   | ±5%                  | ADC 12 bits   | ±1%/ano            | PTH               | —               | 0,2mW  (Tensão CA) | Analógica         | 20s ~ 40s (1/e 63%) | [5,13R$](https://www.makerhero.com/produto/sensor-de-umidade-hr202l-higrometro/)                                                                                                                |

## Pressão:
| Sensor      | Faixa (hPa) | Precisão (typ./máx.) | Resolução    | Deriva Longo Prazo | Encapsulamento  | Consumo Standby | Consumo Ativo  | Interface | Tempo de Resposta | Valor para compra                                                                                                                                        |
| ----------- | ----------- | -------------------- | ------------ | ------------------ | --------------- | --------------- | -------------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LPS22HB** | 260 a 1260  | ±0,1hPa / ±1,0hPa    | 24 bits      | —                  | HLGA-10L        | 1µA             | 12µA           | I2C / SPI | 2,5ns ~100ns      | N/A
| **MS5611**  | 10 a 1200   | ±1,5hPa / ±2,5hPa    | 24 bits      | ±1hPa/ano          | QFN             | 0,14µA          | 1,4mA          | I2C / SPI | ~8,22ms           | [79,90R$](https://www.smartkits.com.br/sensor-de-pressao-atmosferica-gy-63?parceiro=9390) |
| **BMP180**  | 300 a 1100  | ±1,0hPa / ±4,5hPa    | 0,01hPa      | ±1hPa/ano          | LGA (metal-lid) | 0,1µA / 4µA     | 650µA / 1,0mA  | I2C       | 4,5ms ~ 76,5ms    | [6,56R$](https://www.eletrogate.com/sensor-de-pressao-barometrico-bmp-180)                                                                              |
| **BMP280**  | 300 a 1100  | ±1,0hPa / ±1,7hPa    | 0,0016hPa    | ±1hPa/ano          | LGA (metal-lid) | 0,1µA / 0,3µA   | 720µA / 1,12mA | I2C / SPI | 5,5ms ~ 43,2ms    | [5,60R$](https://www.makerhero.com/produto/sensor-de-pressao-e-temperatura-bmp280/?srsltid=AfmBOopCqoIFAp6BhPX3RC5JIYkg1dIOkYtuVFlLqpDHLyf-OjU2tPXUPXo)                                        |
| **BME280**  | 300 a 1100  | ±1,0hPa / ±1,7hPa    | 0,18Pa       | ±1,0hPa/ano        | LGA (metal-lid) | 0,1µA / 0,3µA   | 340µA / 714µA  | I2C / SPI | 1,5ms (I2C)       | [36,96R$](https://www.usinainfo.com.br/sensor-de-pressao-arduino/sensor-de-pressao-umidade-e-temperatura-bme280-de-alta-precisao-33v-4682.html)          |
| **DPS310**  | 300 a 1200  | ±1hPa                | ±0,002 hPa   | —                  | LGA             | 0,5µA           | 280µA / 345µA  | I2C / SPI | 5,2ms ~ 105ms     | [94,90R$](https://www.robocore.net/briick/briick-sensor-de-pressao-dps310)                   |
| **HP203B**  | 300 a 1200  | ±1,5hPa / ±3,0hPa    | 20 bits (Pa) | ±1.5hPa/ano        | LGA             | 0,1µA           | 1,3mA          | I2C       | 2,1ms ~ 78,ms     | N/A                                                |
| **LPS33H**  | 260 a 1260  | ±1,0hPa / ±2,5hPa    | 24 bits      | ±1hPa/ano          | CCLGA 10L       | 1µA             | 12µA           | I2C / SPI | 13ms ~ 300ms      | N/A                                                                         |

## GNSS:

| Sensor   | Redes GNSS Suportadas                      | Sensibilidade<br>(Rastreamento/<br>Cold Start) | Precisão (CEP) | Temperatura<br>de operação | Tempo para Fix           | Interface                                         | Consumo em rastreamento | Valor para compra                                                                                                                                                                                                                   |
| -------- | ------------------------------------------ | ---------------------------------------------- | -------------- | -------------------------- | ------------------------ | ------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NEO-M8N  | GPS, QZSS, SBAS, GLONASS, BeiDou e Galileo | –167 dBm /<br>–148 dBm                         | 2,5m           | -40°C a 85°C               | 27s (Frio) / 1s (Quente) | UART (9,6kbps), I2C (400kbps) e SPI (até 1,0Mbps) | 26,5mA / 34mA           | [122,91R$](https://www.usinainfo.com.br/gps-arduino/modulo-gps-gy-neo-m8n-0-10-para-arduino-antena-8624.html)                                                                                                                         |
| NEO-7M   | GPS, Galileo, SBAS e QZSS                  | –161 dBm /<br>–147 dBm                         | 2,5m           | -40°C a 85°C               | 30s (Frio) / 1s (Quente) | UART, I2C (400kbps) e SPI (até 1,0Mbps)           | 17mA                    | [72,98R$](https://www.usinainfo.com.br/gps-arduino/modulo-gps-ublox-gy-neo-7m-0-000-com-antena-8744.html)                                                                                                                             |
| NEO-6M   | GPS                                        | –167 dBm /<br>–147 dBm                         | 2,5m           | -40°C a 85°C               | 27s (Frio) / 1s (Quente) | UART, I2C (400kbps) e SPI                         | 37mA                    | [35,31R$](https://loja.fabricadebolso.com.br/modulo-neo-6m-gps?utm_source=Site&utm_medium=GoogleShopping&utm_campaign=IntegracaoGoogle)                                                                                               |
| BN-220   | GPS, GLONASS, Galileo, BeiDou, QZSS e SBAS | –167 dBm /<br>–148 dBm                         | 2,0m           | -40°C a 85°C               | 16s (Frio) / 1s (Quente) | UART (4,8kbps a 92,16kbps)                        | 50mA                    | [90,35R$](https://www.mercadolivre.com.br/modulo-gps-bn-220-com-flash-hmc5883-compass-glonass-beidou/p/MLB2000803226?matt_tool=18956390&utm_source=google_shopping&utm_medium=organic&pdp_filters=item_id:MLB5241942678&from=gshop) |
| L86      | GPS e GLONASS                              | –165 dBm /<br>–148 dBm                         | 2,5m           | -40°C a 85°C               | 15s (Frio) / 1s (Quente) | UART (4,8kbps a 92,16kbps)                        | 26mA                    | N/A                                                                                                                                                                                                                                 |
| ATGM336H | GPS, QZSS, SBAS, GLONASS, BeiDou e Galileo | –162 dBm /<br>–148 dBm                         | 2,0m           | -40°C a 85°C               | 35s (Frio) / 1s (Quente) | UART (4,8kbps a 92,16kbps)                        | 25mA                    | [99,71R$](https://curtocircuito.com.br/modulo-gps-atgm336h.html)                                                                                                                                                                    |



---
## Informações sobre os sensores

### SHT31-DIS - Sensor Digital de Temperatura e Umidade

Informações Gerais:

- Interface: I2C (clock máximo de 1 MHz)
- Endereços I2C:
  - 0x44 (ADDR conectado ao GND)
  - 0x45 (ADDR conectado ao VDD)

Temperatura:

- Faixa: -40°C a 125°C
- Precisão: ±0.2°C (entre 0ºC e 90ºC, typ.) e ±0.7°C (máx.)
- Resolução: 0.01ºC
- Deriva de longo prazo: < 0,03°C/ano

Umidade relativa:

- Faixa: 0% a 100 %
- Precisão (a 25°C): ±2% (typ.) e ±3% (máx.)
- Resolução: 0.01%
- Deriva de longo prazo: < 0,25%/ano

Tipos de encapsulamentos:

- ***Open-cavity DFN***

Características elétricas:

- Tensão de operação: 2,15V a 5,5V
- Consumo de corrente (Ativo):  600µA (typ.) e 1,5mA (máx)
- Consumo de corrente (Standby): 0,2µA (typ.) e 6µA (máx.)

Tempo de resposta:

- Umidade: ~8 segundos (1/e 63%)
- Temperatura: ~4 segundos (1/e 63%)
- Comunicação: ~4 ms para pacote completo via I2C

### SHT35-DIS - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: I2C (clock máximo de 1 MHz)
- Endereços I2C:
  - 0x44 (ADDR conectado ao GND)
  - 0x45 (ADDR conectado ao VDD)

Temperatura:

- Faixa: -40°C a 125°C
- Precisão: ±0.1°C (entre 20ºC e 60ºC, typ.) e ±0.6°C (máx.)
- Resolução: 0.01ºC
- Deriva de longo prazo: < 0,03°C/ano

Umidade relativa:

- Faixa: 0% a 100 %
- Precisão (a 25°C): ±1,5% (typ.) e ±3% (máx.)
- Resolução: 0,01%
- Deriva de longo prazo: < 0,25%/ano

Tipos de encapsulamentos:

- ***Open-cavity DFN***

Características elétricas:

- Tensão de operação: 2,15V a 5,5V
- Consumo de corrente (Ativo):  600µA (typ.) e 1,5mA (máx)
- Consumo de corrente (Standby): 0,2µA (typ.) e 6µA (máx.)

Tempo de resposta:

- Umidade: ~8 segundos (1/e 63%)
- Temperatura: ~4 segundos (1/e 63%)
- Comunicação: ~4 ms para pacote completo via I2C

### SHT85 - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: I2C (clock máximo de 1 MHz)

Temperatura:

- Faixa: -40°C a 105°C
- Precisão: ±0.1°C (entre 20ºC e 50ºC, typ.) e ±0.6°C (máx.)
- Resolução: 0,01ºC
- Deriva de longo prazo: < 0,03°C/ano

Umidade relativa:

- Faixa: 0% a 100 %
- Precisão (a 25°C): ±1,5% (typ.) e ±3% (máx.)
- Resolução: 0,01%
- Deriva de longo prazo: < 0,25%/ano

Tipos de encapsulamentos:

- ***IP67 housing with hydrophobic membrane filter***

Características elétricas:

- Tensão de operação: 2,15V a 5,5V
- Consumo de corrente (Ativo):  600µA (typ.) e 1,5mA (máx)
- Consumo de corrente (Standby): 0,2µA (typ.) e 12µA (máx.)

Tempo de resposta:

- Umidade: ~8 segundos (1/e 63%)
- Temperatura: ~4 segundos (1/e 63%)
- Comunicação: ~4 ms para pacote completo via I2C

### LM75 - Sensor Digital de Temperatura

Informações gerais:

- Interface: I2C standard (até 100 kHz).
- Endereços I2C: configuráveis via pinos A0, A1, A2 (até 8 dispositivos).

Temperatura:

- Faixa: -55°C a 125°C
- Precisão:
  - ±2.0 °C (de -25°C a 100°C)
  - ±3.0 °C (de -55°C a 125°C)
- Resolução: 9 bits

Tipos de encapsulamentos:

- **SOP-8** (SMD)
- **MSOP-8** (SMD)

Características elétricas:

- Tensão de operação: 3,0V a 5,5V
- Consumo de corrente (Ativo):  250µA (typ.) e 1mA (máx.)
- Consumo de corrente (Standby): 4µA (3V, máx.) e 6µA (5V, máx.)

Tempo de resposta:

- Tempo de conversão: ~100 ms
- Comunicação I2C: ~100 µs para dados

### DS18B20 - Sensor Digital de Temperatura

Informações gerais:

- Interface: 1-Wire (requere apenas um fio de dados + GND)

Temperatura:

- Faixa: -55°C a 125°C
- Precisão: ±0.5 °C (de -10°C a 85°C) e ±2ºC (entre -55ºC e 125ºC)
- Resolução configurável: 9 a 12 bits
  - 9 bits: 0.5°C
  - 10 bits: 0.25°C
  - 11 bits: 0.125°C
  - 12 bits: 0.0625°C

Tipos de encapsulamentos:

- **TO-92** (3 pinos)
- **SOIC-8** (SMD)
- Encapsulamento a prova d’água

Características elétricas:

- Tensão de operação: 3,0V a 5,5V
- Consumo de corrente (Standby): 0,75µA (typ.) e 1,0µA (máx.)
- Consumo de corrente (Ativo): 1,0mA (typ.) e 1,5mA (máx.)

Tempo de resposta:

- Conversão temperatura: ~750 ms (resolução máxima)
- Comunicação 1-Wire: alguns ms para dados

### LM35 - Sensor Analógico de Temperatura

Informações gerais:

- Interface: Analógica

Temperatura:

- Faixa: -55°C a 150°C
- Precisão: ±0.4°C (a 25ºC, typ.) e ±1.5ºC (máx.)
- Resolução: Dependente do ADC da ESP32 (12 bits, resolução teórica de 0,08ºC)
- não-linearidade: ±0,3 °C (typ.) e ±0,5 °C (máx.)

Tipos de encapsulamentos:

- **TO-46**
- **SOIC-8** (SMD)
- **TO-92**
- **TO-220**

Características elétricas:

- Tensão de operação: 4V a 30V
- Consumo de corrente (Constante): 56µA (5V e 25ºC, typ.) e 161µA (máx.)

Tempo de resposta:

- Quase instantâneo (sinal analógico)
- Conversão ADC depende do microcontrolador (~µs a ms)

### LM35DZ - Sensor Analógico de Temperatura

Informações gerais:

- Interface: Analógica

Temperatura:

- Faixa: 0°C a 100°C
- Precisão: ±0.6°C (a 25ºC, typ.) e ±2,0ºC (máx.)
- Resolução: Dependente do ADC da ESP32 (12 bits, resolução teórica de 0,08ºC)
- não-linearidade: ±0,2 °C (typ.) e ±0,5 °C (máx.)

Tipos de encapsulamentos:

- **TO-46**
- **SOIC-8** (SMD)
- **TO-92**
- **TO-220**

Características elétricas:

- Tensão de operação: 4V a 30V
- Consumo de corrente (Constante): 56µA (5V e 25ºC, typ.) e 141µA (máx.)

Tempo de resposta:

- Quase instantâneo (sinal analógico)
- Conversão ADC depende do microcontrolador (~µs a ms)

### DHT11 - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: Serial (Single-wire, bidirecional)
- Taxa de transmissão: ~10kbps

Temperatura:

- Faixa: 0°C a 50°C
- Precisão: ±1ºC (mín.) e ±2°C (máx.)
- Resolução: 8 bits (1ºC)

Umidade relativa:

- Faixa: 30% a 90% (0ºC), 20% a 90% (25ºC) e 20% a 80% (50ºC)
- Precisão: ±4% (25ºC) e ±5% (0-50ºC)
- Resolução: 8 bits (1%)
- Deriva de longo prazo: ±1%/ano

Tipos de encapsulamentos:

- **4 Pin Single Row**

Características elétricas:

- Tensão de operação: 3V a 5,5V
- Consumo de corrente (Ativo):  0,5mA (mín.) e 2,5mA (máx)
- Consumo de corrente (Standby): 100µA (mín.) e 150µA (máx.)

Tempo de resposta:

- Umidade: 6 a 15 segundos (1/e 63%)
- Temperatura: 6 a 30 segundos (1/e 63%)
- Comunicação: ~4 ms para pacote completo

### DHT22 - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: Serial (Single-wire, bidirecional)
- Tempo para leitura: 2s
- Taxa de transmissão: ~8kbps

Temperatura:

- Faixa: -40°C a 80°C
- Precisão: <±0,5ºC
- Resolução: 0,1ºC

Umidade relativa:

- Faixa: 0% a 100%
- Precisão: ±2% (typ.) e ±5% (máx.)
- Resolução: 0,1%
- Deriva de longo prazo: ±0,5%/ano

Tipos de encapsulamentos:

- **4 Pin Single Row**

Características elétricas:

- Tensão de operação: 3,3V a 6V
- Consumo de corrente (Ativo):  1mA (mín.) e 1,5mA (máx)
- Consumo de corrente (Standby): 40µA (mín.) e 50µA (máx.)

Tempo de resposta:

- Umidade e temperatura: ~2 segundos (mínimo entre leituras)
- Comunicação: ~5 ms para pacote completo

### MCP9808 - Sensor Digital de Temperatura

Informações gerais:

- Interface: I2C standard (até 400 kHz).
- Endereços I2C: configuráveis via pinos A0, A1, A2

Temperatura:

- Faixa: -40°C a 125°C
- Precisão: ±0,25 °C (de -25°C a 100°C) e ±1,0 °C (máx.)
- Resolução configurável: +0.5°C, +0.25°C, +0.125°C, +0.0625°C

Tipos de encapsulamentos:

- **8-Lead DFN** (SMD)
- **MSOP-8** (SMD)

Características elétricas:

- Tensão de operação: 2,7V a 5,5V
- Consumo de corrente (Ativo):  200µA (typ.) e 400µA (máx.)
- Consumo de corrente (Standby): 0,1µA (typ.) e 2µA (máx.)

### Tempo de Conversão

- 0.5°C (9 bits): **30 ms**
- 0.25°C (10 bits): **65 ms**
- 0.125°C (11 bits): **130 ms**
- 0.0625°C (12 bits): **250 ms**

### AHT25 - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: I2C standard (até 100kHz)
- Tempo para leitura: 2s

Temperatura:

- Faixa: -40°C a 80°C
- Precisão: ±0,3ºC (typ.) e ±2ºC (máx.)
- Resolução: 0,01ºC
- Deriva de longo prazo: ±0,1ºC/ano

Umidade relativa:

- Faixa: 0% a 100%
- Precisão: ±2% (typ.) e ±6% (máx.)
- Resolução: 0.024%
- Deriva de longo prazo: <1%/ano

Tipos de encapsulamentos:

- ***SMD de 4 pinos***

Características elétricas:

- Tensão de operação: 2,2V a 5,5V
- Consumo de corrente (Ativo):  980µA
- Consumo de corrente (Standby): 250nA

Tempo de resposta:

- Umidade: <8 segundos (1/e 63%)
- Temperatura: 5 a 30 segundos (1/e 63%)

### HTU21D - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: I2C (até 400 kHz).

Temperatura:

- Faixa: -40°C a 125°C
- Precisão:±0,3°C (typ.) e ±1,6 °C (máx.)
- Resolução: 12 (0,04ºC) a 14 bits (0,01ºC)

Umidade relativa:

- Faixa: 0% a 100%
- Precisão: ±2% (typ.) e ±5% (máx.)
- Resolução configurável: 8 (0,7%) a 12 (0,04%) bits
- Deriva de longo prazo: ±0,5%/ano

Tipos de encapsulamentos:

- **DFN**

Características elétricas:

- Tensão de operação: 1,5V a 3,6V
- Consumo de corrente (Ativo):  450µA (typ.) e 500µA (máx.)
- Consumo de corrente (Standby): 0,02µA (typ.) e 0,14µA (máx.)

Tempo de resposta:

- Tempo de conversão (umidade): 16ms (resolução máxima)
- Tempo de conversão (temperatura): 50ms (resolução máxima)

### BMP280 - Sensor Digital de Temperatura e Pressão

Informações gerais:

- Interface: I2C (clock máximo de 3,4 MHz)
- Interface SPI (3 e 4 fios, clock máximo de 10 MHz)

Temperatura:

- Faixa: -40°C a 85°C
- Precisão: ±0.5°C (typ.) e ±1,0°C (máx.)
- Resolução: 0.01ºC (podendo chegar a *0.0003 °C*)

### Pressão

- Faixa: 300hPa a 1100hPa
- Precisão: ±1.0hPa (typ.) e ±1.7hPa (máx.)
- Resolução: 0.0016hPa (podendo chegar a *0.16Pa*)
- Deriva de longo prazo: 1,0hPa/ano

Tipos de encapsulamentos:

- ***8-pin metal-lid LGA***

Características elétricas:

- Tensão de operação: 1,71V a 3,6V
- Consumo de corrente (Ativo):  720µA (typ.) e 1,12mA (máx)
- Consumo de corrente (Standby): 0,1µA (typ.) e 0,3µA (máx.)

Tempo de resposta:

- Tempo de medição: 5,5ms (menor resolução), 43,2ms (maior resolução)

### BME280 - Sensor Digital de Temperatura, Umidade e Pressão

Informações gerais:

- Interface: I2C (clock máximo de 3,4 MHz)
- Interface SPI (3 e 4 fios, clock máximo de 10 MHz)

Temperatura:

- Faixa: -40°C a 85°C
- Precisão: ±0.5°C (typ.) e ±1,5°C (máx.)
- Resolução: 0.01ºC

Umidade relativa:

- Faixa: 0% a 100%
- Precisão: ±3% (20-80%, 25 °C, typ.)
- Resolução configurável: 0.008%
- Deriva de longo prazo: ±0,5%/ano

Pressão:

- Faixa: 300hPa a 1100hPa
- Precisão: ±1.0hPa (typ.) e ±1.7hPa (máx.)
- Resolução: 0.18Pa
- Deriva de longo prazo: 1,0hPa/ano

Tipos de encapsulamentos:

- ***8-pin metal-lid LGA***

Características elétricas:

- Tensão de operação: 1,71V a 3,6V
- Consumo de corrente (Ativo, Pressão):  714µA
- Consumo de corrente (Ativo, Umidade):  340µA
- Consumo de corrente (Ativo, Temperatura):  350µA
- Consumo de corrente (Standby): 0,1µA (typ.) e 0,3µA (máx.)

Tempo de resposta:

- Tempo de resposta: 1,5ms para I2C em 400 kHz.

### AHT10 - Sensor Digital de Temperatura e Umidade

Informações gerais:

- Interface: I2C (até 400 kHz).

Temperatura:

- Faixa: -40°C a 85°C
- Precisão:±0,3°C (typ.) e ±1,75 °C (máx.)
- Resolução: 0,01ºC
- Deriva de longo prazo: < 0,04ºC/ano

Umidade relativa:

- Faixa: 0% a 100%
- Precisão: ±2% (typ.) e ±5% (máx.)
- Resolução: 0.024%
- Deriva de longo prazo: < 0,5%/ano

Tipos de encapsulamentos:

- **similar to QFN**

Características elétricas:

- Tensão de operação: 1,8V a 3,6V
- Consumo de corrente (Ativo):  0,25µA (máx.)
- Consumo de corrente (Standby): 25µA (máx.)

Tempo de resposta:

- Umidade: <8 segundos (1/e 63%)
- Temperatura: 5 a 30 segundos (1/e 63%)

### HIH-4031 - Sensor Analógico de Umidade

Informações Gerais:
- Interface: Analógica
Umidade Relativa:
- Faixa: 0% a 100% (máx.)
- Precisão: ±3,5%
- Resolução: ADC da ESP32 (12 bits)
- Deriva de longo prazo: ±1.2%/ano

Tipos de Encapsulamento:
- **SMD**

Características Elétricas:
- Tensão de operação: 4V a 5,8V
- Consumo de corrente (Constante):  200µA (typ.) e 500µA (máx.)
Tempo de Resposta:
- Umidade: 5 segundos (1/e 63%)

### HR202L - Sensor Analógico de Umidade

Informações Gerais:
- Interface: Analógica
Umidade Relativa:
- Faixa: 20% a 95% (operacional)
- Precisão: ±5% (typ., em 25 °C / 1 kHz / 1 VAC)
- Resolução: ADC da ESP32 (12 bits)
- Deriva de longo prazo: ±1%/ano

Tipos de Encapsulamento:
- **PTH**

Características Elétricas:
- Alimentação recomendada: 1 VAC (senoidal), 1 kHz
- Tensão: 1.5 VAC (máx.)
- Potência: 0.2 mW (máx.)
- Frequência de operação: 500 Hz a 2 kHz
- Faixa de variação da impedância: 19.8 kΩ – 50.2 kΩ
Tempo de Resposta:
- Aumento da umidade: < 20s (1/e 63%)
- Diminuição da umidade < 40s(1/e 63%)

### LPS22HB - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C (até 400kHz) e SPI

Pressão:
- Faixa: 260hPa a 1260hPa
- Precisão: ±0,1hPa (typ.) e ±1hPa (máx.)
- Resolução: 24 bits
Temperatura:

- Faixa: -40ºC a 85ºC
- Precisão: ±1,5ºC
- Resolução: 0,01ºC

Tipos de Encapsulamento:
- **HLGA-10L**
Características Elétricas:

- Tensão de operação: 1,7V a 3,6V
- Consumo de corrente (Ativo):  12µA (máx.)
- Consumo de corrente (Standby): 1µA (máx.)

Tempo de Resposta:
- SPI: 100ns
- I2C: 2,5 - 10µs

### MS5611 - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C e SPI (até 20MHz)

Pressão:
- Faixa: 10mbar a 1200mbar
- Precisão: ±1,5mbar (typ.) e ±2,5mbar (máx.)
- Resolução: 24 bits
- Deriva de longo prazo: ±1mbar/ano

Temperatura:
- Faixa: -40ºC a 85ºC
- Precisão: ±0,8ºC
- Resolução: 24 bits

Tipos de Encapsulamento:
- **QFN**

Características Elétricas:
- Tensão de operação: 1,8V a 3,6V
- Consumo de corrente (Ativo):  1,4mA (máx.)
- Consumo de corrente (Standby): 0,14µA (máx.)

Tempo de Resposta:
- Resolução máxima: 8,22ms

### BMP180 - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C (clock máximo de 3,4 MHz)

Temperatura:
- Faixa: -40°C a 85°C
- Precisão: ±0,5°C (typ.) e ±2,0°C (máx.)
- Resolução: 0,1ºC 

Pressão:
- Faixa: 300hPa a 1100hPa
- Precisão: ±1,0hPa (typ.) e ±4,5hPa (máx.)
- Resolução: 0,01hPa
- Deriva de longo prazo: ±1,0hPa/ano

Tipos de Encapsulamento:
- ***8-pin metal-lid LGA***

Características Elétricas:
- Tensão de operação: 1,8V a 3,6V
- Consumo de corrente (Ativo):  650µA (typ.) e 1,0mA (máx)
- Consumo de corrente (Standby): 0,1µA (typ.) e 4µA (máx.)

 Tempo de Resposta:
- Tempo de medição: 4,5ms (menor resolução), 76,5ms (maior resolução)

### DPS310 - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C (clock máximo de 3,4 MHz) e SPI (Até 10MHz)

Temperatura:
- Faixa: -40°C a 85°C
- Precisão: ±0.5°C (typ.) e ±1,0°C (máx.)
- Resolução: 0,01ºC

Pressão:
- Faixa: 300hPa a 1200hPa
- Precisão: ±1hPa
- Resolução: ±0,002 hPa

Tipos de Encapsulamento:
- ***8-pin LGA***

Características Elétricas:
- Tensão de operação: 1,7V a 3,6V
- Consumo de corrente (Ativo):  280µA (typ.) e 345µA (máx)
- Consumo de corrente (Standby): 0,5µA

Tempo de Resposta:
- Tempo de medição: 5,2ms (menor resolução), 105ms (maior resolução)


### HP203B - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C (clock máximo de 400kHz)

Temperatura:
- Faixa: -40°C a 85°C
- Precisão: ±0,5°C (typ.) e ±3,0°C (máx.)
- Resolução: 20 bits

Pressão:
- Faixa: 300mbar a 1200mbar
- Precisão: ±1,5mbar (typ.) e ±3,0mbar (máx.)
- Resolução: 20 bits (em Pa)
- Deriva de longo prazo: ±1,5mbar/ano

Tipos de Encapsulamento:
- ***8-pin LGA***

Características Elétricas:
- Tensão de operação: 1,8V a 3,6V
- Consumo de corrente (Ativo):  1,3mA
- Consumo de corrente (Standby): < 0,1μA

Tempo de Resposta:
- Tempo de medição: 2,1ms (menor resolução), 78,7ms (maior resolução)

### LPS33HW - Sensor Digital de Temperatura e Pressão

Informações Gerais:
- Interface: I2C (clock máximo de 3,4 MHz) e SPI (Até 10MHz)

Temperatura:
- Faixa: -40°C a 85°C
- Precisão: N/A
- Resolução: 0,01ºC

Pressão:
- Faixa: 260hPa a 1260hPa
- Precisão: ±1hPa (typ.) e ±2,5hPa (máx.)
- Resolução: 24 bits
- Deriva de longo prazo: 1hPa/ano

Tipos de Encapsulamento:
- ***CCLGA 10L***

Características Elétricas:
- Tensão de operação: 1,7V a 3,6V
- Consumo de corrente (Ativo):  12µA
- Consumo de corrente (Standby): 1µA

Tempo de Resposta:
- **Sem filtro:** ~13 ms (ODR = 75Hz)
- **Com filtro RMS:** ~200–300 ms (ODR = 75Hz)

### NEO-M8N - Chip de Localização GNSS

Informações Gerais:
- Interface: UART (9,6kbps), I2C (400kbps) e SPI (até 1,0Mbps)
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –167 dBm
	- Reaquisição de Sinal: –160 dBm 
	- Inicialização a Frio: –148 dBm
	- Inicialização a Quente: –156 dBm 
- Redes GNSS alcançáveis: GPS, QZSS, SBAS, GLONASS, BeiDou e Galileo
- Precisão no plano horizontal: 2,5m (CEP)

Características Elétricas:
- Tensão de operação: 2,7V a 3,6V
- Tensão da bateria 1,4V a 3,6V
- Consumo de corrente:
	- Pico Máximo: 67mA
	- Aquisição: 27mA a 34mA
	- Rastreamento (Contínuo): 26,5mA a 34mA

Tempo para FIX:
- Inicialização a Frio:  27s
- Inicialização com ajuda: 4s
- Inicialização a Quente: 1s

### NEO-7M - Chip de Localização GNSS

Informações Gerais:
- Interface: UART, I2C (400kbps) e SPI (até 1,0Mbps)
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –161 dBm
	- Reaquisição de Sinal: –160 dBm 
	- Inicialização a Frio: –147 dBm
	- Inicialização a Quente: –155 dBm 
- Redes GNSS alcançáveis: GPS, Galileo, SBAS e QZSS
- Precisão no plano horizontal: 2,5m (CEP)

Características Elétricas:
- Tensão de operação: 1,65V a 3,6V
- Tensão da bateria 1,4V a 3,6V
- Consumo de corrente: 
	- Pico Máximo: 67mA
	- Aquisição: 22mA
	- Rastreamento (Contínuo): 17 mA

Tempo para FIX:
- Inicialização a Frio:  30s
- Inicialização com ajuda: 5s
- Inicialização a Quente: 1s

### NEO-6M - Chip de Localização GNSS

Informações Gerais:
- Interface: UART, I2C (400kbps) e SPI
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –167 dBm
	- Reaquisição de Sinal: –161 dBm 
	- Inicialização a Frio: –147 dBm
	- Inicialização a Quente: –156 dBm 
- Redes GNSS alcançáveis: GPS
- Precisão no plano horizontal: 2,5m (CEP)

Características Elétricas:
- Tensão de operação: 2,7V a 3,6V
- Tensão da bateria 1,4V a 3,6V
- Consumo de corrente: 
	- Pico Máximo: 67mA
	- Aquisição: 27mA a 34mA
	- Rastreamento (Contínuo): 37 mA

Tempo para FIX:
- Inicialização a Frio:  27s
- Inicialização com ajuda: < 3s
- Inicialização a Quente: 1s

### BN-220 - Chip de Localização GNSS

Informações Gerais:
- Interface: UART (4,8kbps a 92,16kbps)
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –167 dBm
	- Reaquisição de Sinal: –160 dBm 
	- Inicialização a Frio: –148 dBm
	- Inicialização a Quente: –156 dBm 
- Redes GNSS alcançáveis: GPS, GLONASS, Galileo, BeiDou, QZSS e SBAS
- Precisão no plano horizontal: 2,0m (CEP)

Características Elétricas:
- Tensão de operação: 3,0V a 5,5V
- Consumo de corrente: 50mA

Tempo para FIX:
- Inicialização a Frio:  16s
- Inicialização a Quente: 1s

### L86 - Chip de Localização GNSS

Informações Gerais:
- Interface: UART (4,8kbps a 92,16kbps)
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –165 dBm
	- Reaquisição de Sinal: –160 dBm 
	- Aquisição de Sinal: –148 dBm
- Redes GNSS alcançáveis: GPS e GLONASS
- Precisão no plano horizontal: 2,5m (CEP)

Características Elétricas:
- Tensão de operação: 3,0V a 4,3V
- Tensão da bateria 1,5V a 4,3V
- Consumo de corrente: 
	- Aquisição: 30mA
	- Rastreamento (Contínuo): 26mA
	- Standby: 1mA

Tempo para FIX:
- Inicialização a Frio: 15s
- Inicialização a Quente: 1s

### ATGM336H - Chip de Localização GNSS
Informações Gerais:
- Interface: UART (4,8kbps a 92,16kbps)
- Temperatura de operação: -40°C a 85°C

Leitura:
- Sensibilidade: 
	- Rastreamento: –162 dBm
	- Reaquisição de Sinal: –160 dBm 
	- Inicialização a Frio: –148 dBm
	- Inicialização a Quente: –156 dBm 
- Redes GNSS alcançáveis: GPS, QZSS, SBAS, GLONASS, BeiDou e Galileo
- Precisão: 2,0m (CEP)

Características Elétricas:
- Tensão de operação: 2,7V a 3,6V
- Tensão da bateria 1,5V a 3,6V
- Consumo de corrente: 
	- Pico Máximo: 100mA
	- Típico: 25mA

Tempo para FIX:
- Inicialização a Frio:  35s
- Inicialização a Quente: 1s

---
