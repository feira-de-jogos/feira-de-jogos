# Versão 1 da estação meteorológica.

### Objetivo:
- Aprimorar a versão 0 com sensores melhores para garantir mais qualidade e confiabilidade dos dados coletados.
- Adicionar os sensores requisitados que não foram instalados na v0.

### Sensores instalados até o momento:
1. **BMP280 (Temperatura e Pressão), módulo interno usado**
2. **DHT22 (Temperatura e Umidade), [esse](https://github.com/PaszaVonPomiot/micropython-driver-bmp280) módulo foi usado**

### Dados sobre os sensores pesquisados (instalados ou não):

#### 1. ATH25 - Temperatura e Umidade (Não instalado)

*ALIMENTAÇÃO:*  
- 2.2 - 5.5 V

*CONSUMO DE CORRENTE:*  
- Stand-by: 0,25 µA  
- Medição: 980 µA

*UMIDADE:** 
- Resolução: 0.024%  
- Faixa máxima: 0 - 100%
- Precisão:  
  - Tolerância média: 2%  
  - Tolerância máxima: 6%

*TEMPERATURA:*  
- Resolução: 0.01 ºC  
- Precisão:  
  - Média: ±0.3 ºC  
  - Máxima distorção: ±2 ºC (acima de 50ºC ou abaixo de 0 ºC)  
- Máxima medida:  
  - 50 ºC em 100% umidade  
  - 80 ºC em 20% umidade  
- Mínima medida:  
  - -40 ºC em 100% umidade  
  - 0 ºC em 10% umidade

*VALOR TÍPICO DE TRABALHO:*
- Temperatura: 0 — 60 ºC  
- Umidade: 20 - 80%

*COMUNICAÇÃO: I2C*  


#### 2. DHT22 - Temperatura e Umidade (Instalado)

*ALIMENTAÇÃO:*  
- 3,3 - 6 V

*CONSUMO DE CORRENTE:*  
- Stand-by: 40~50 µA  
- Medição: 1~1,5 mA

*COMUNICAÇÃO: Digital por fio único*  

*UMIDADE:*  
- Faixa: 0 - 100%  
- Precisão:  
  - Média: ±2%  
  - Tolerância máxima: ±5%  
- Resolução: 0.1%

*TEMPERATURA:*  
- Precisão:  
  - Máxima distorção: ±0,5 ºC  
- Faixa: -40 — 80 ºC  
- Resolução: 0.1 ºC

*ESTABILIDADE:*  
- ±0.5% ao ano (umidade)

*TEMPO PARA LEITURA:*  
- 2 s   

#### 3. LM35DZ - Temperatura

*ALIMENTAÇÃO:*  
- Faixa de entrada: -1 V a 30 V

*COMUNICAÇÃO:*  
- Analógica

*TEMPERATURA:*  
- Faixa de leitura: 0 — 100 ºC  
- Precisão:  
  - Típica: ±0,6 ºC  
  - Máxima: ±2,0 ºC

*CONSUMO DE CORRENTE:*  
- Típico: 56 µA  
- Máximo: 141 µA

*ESTABILIDADE:*  
- ±0,08 ºC a cada 1000 h na temperatura máxima
