# MicroPython

O código em MicroPython requer o arquivo de configuração `.env` conforme o exemplo a seguir:

```ini
WIFI_SSID=em
WIFI_KEY=estacao-meteorologica
NTP_POOL=pool.ntp.br
NTP_TIMEOUT=1
MQTT_CLIENT_ID=EMv0
MQTT_BROKER=feira-de-jogos.dev.br
```

O arquivo `Makefile` contém todos os comandos necessários para instalar as dependências:

```sh
make
```

bem como instalar o código da aplicação:

```sh
make write
```
