# Versão 1 da estação meteorológica.

### Objetivo:
- Aprimorar a versão 0 com sensores melhores para garantir mais qualidade e confiabilidade dos dados coletados.
- Adicionar os sensores requisitados que não foram instalados na v0.

---
# SHT31 - Sensor Digital de Temperatura e Umidade

### Informações Gerais:
- Interface: I2C (clock máximo de 1 MHz)
- Endereços I2C:
	 - 0x44 (ADDR conectado ao GND)
	 - 0x45 (ADDR conectado ao VDD)
	- Tempo de resposta (temperatura): <2s
	- Tempo de resposta (umidade): 8s
### Temperatura:
- Faixa: -40°C a 125°C
- Precisão: ±0.3°C (entre 10ºC e 55ºC, typ.) e ±0.5°C (máx.)
- Resolução: 14 bits
- Deriva de longo prazo: < 0,03°C/ano
### Umidade Relativa:
- Faixa: 0% a 100 %
- Precisão (em 25°C): ±2% (typ.) e ±3% (máx.)
- Resolução: 14 bits (~0,0061%)
- Deriva de longo prazo: < 0,25%/ano
### Tipos de Encapsulamento:
- **open-cavity DFN**
### Características Elétricas:
- Tensão de operação: 2,15 V a 5,5 V
- Consumo de corrente (Standby): 0,2µA (typ.) e 6µA (máx.)
- Consumo de corrente (Ativo):  600µA (typ.) e 1,5mA (máx)

---

# LM75 - Sensor Digital de Temperatura

### Informações Gerais:
- Interface: I2C standard (até 100 kHz).
- Endereços I2C: configuráveis via pinos A0, A1, A2 (até 8 dispositivos).
- Tempo de conversão:  100ms (typ.), 300ms (máx.).
### Temperatura:
- Faixa: -55°C a 125°C
- Precisão:
	- ±2.0 °C (de -25°C a 100°C)
	- ±3.0 °C (de -55°C a 125°C)
- Resolução: 0.5 °C (9 bits)
### Tipos de Encapsulamento:
- **SOP-8** (SMD)
- **MSOP-8** (SMD)
### Características Elétricas:
- Tensão de operação: 3,0V a 5,5V
- Consumo de corrente (Ativo):  250µA (typ.) e 1mA (máx.)
- Consumo de corrente (Standby): 4µA (3V, máx.) e 6µA (5V, máx.)
---
# DS18B20 - Sensor Digital de Temperatura
### Informações Gerais:
- Interface: 1-Wire (requere apenas um fio de dados + GND)
- Tempo para conversão de temperatura: 750ms (usando a resolução máxima)
- Tempo para entrega dos dados após a leitura: 5ms
### Temperatura:
- Faixa: -55°C a 125°C
- Precisão: ±0.5 °C (de -10°C a 85°C) e ±2ºC (entre -55ºC e 125ºC)
- Resolução configurável: 9 a 12 bits
	 - 9 bits: 0.5°C
	 - 10 bits: 0.25°C
	 - 11 bits: 0.125°C
	 - 12 bits: 0.0625°C
### Tipos de Encapsulamentos:
-  **TO-92** (3 pinos)
-  **8-Pin SOIC** (SMD)
-  **Encapsulamento a Prova D’água**
### Características Elétricas:
- Tensão de operação: 3,0V a 5,5V
- Consumo de corrente (Standby): 0,75µA (typ.) e 1,0µA (máx.) 
- Consumo de corrente (Ativo): 1,0mA (typ.) e 1,5mA (máx.)

---