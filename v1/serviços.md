# Preparação do ambiente dos serviços em nuvem

Todas as aplicações rodaram em mesmo servidor, dado o pequeno volume de processamento e de armazenamento de cada uma. 

## Serviços

A distrição usada, Debian Linux, usa o Systemd para o gerenciamento de processos. Nos casos em que foi necessário adicionar configuração do Systemd, o arquivo de serviço foi adicionado ao diretório `/etc/systemd/system`.

### Broker MQTT: Mosquitto

Arquivo de configuração do acesso via rede local do `mosquitto`, `/etc/mosquitto/conf.d/local.conf`:

```ini
listener 1883
```

Arquivo de configuração de acesso via WebSocket, com NGINX como _proxy_ reverso, do `mosquitto`, `/etc/mosquitto/conf.d/remoto.conf`:

```ini
listener 8080 ::1
protocol websockets
```

Arquivo de configuração da autenticação do `mosquitto`, `/etc/mosquitto/conf.d/senharemoto.conf`:

```ini
password_file /etc/mosquitto/pwfile
```

O arquivo com as senhas foi gerado pelo comando `mosquitto_passwd`.

### Proxy reverso HTTPS: NGINX

_Site_ padrão, arquivo `/etc/nginx/sites-enabled/default`:

```
server {
  listen 80;
  listen [::]:80;
  server_name feira-de-jogos.sj.ifsc.edu.br;

  if ($host = feira-de-jogos.sj.ifsc.edu.br) {
    return 301 https://$host$request_uri;
  }

  return 404;
}

server {
  listen [::]:443 http2 ssl ipv6only=on;
  listen 443 http2 ssl;
  server_name feira-de-jogos.sj.ifsc.edu.br;
  
  ssl_certificate /etc/letsencrypt/live/feira-de-jogos.sj.ifsc.edu.br/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/feira-de-jogos.sj.ifsc.edu.br/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
  }

  location /mqtt/ {
    proxy_pass http://ip6-localhost:8080/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
  }

  root /opt/github/feira-de-jogos/nuvem/frontend;
  index index.html index.htm index.nginx-debian.html;
  location / {
    try_files $uri $uri/ =404;
  }
}
```

### Servidor STUN/TURN: Coturn

Arquivo padrão do Coturn, `/etc/turnserver.conf`:

```ini
cli-password=ifsc

# Rede
listening-ip=0.0.0.0
listening-ip=::

# Transporte
listening-port=3478
min-port=49152
max-port=65535

# Logging
#syslog
#verbose

# Identificação do servidor
server-name=feira-de-jogos.sj.ifsc.edu.br
realm=feira-de-jogos.sj.ifsc.edu.br

# TLS
fingerprint
cert=/etc/letsencrypt/live/feira-de-jogos.sj.ifsc.edu.br/fullchain.pem
pkey=/etc/letsencrypt/live/feira-de-jogos.sj.ifsc.edu.br/privkey.pem
no-tlsv1
no-tlsv1_1

# Autenticação
lt-cred-mech
user=adcipt:adcipt20232
```

### REST API: aplicação Node.js

Serviço API, `/etc/systemd/system/api.service`:

```ini
[Unit]
Description=Feira de jogos
Documentation=https://github.com/feira-de-jogos/nuvem
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node servidor.js
WorkingDirectory=/opt/github/feira-de-jogos/nuvem/api
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Arquivo `.env`:

```ini
PGDATABASE="feira"
PGPASSWORD="feira"
PGHOST="localhost"
PGUSER="feira"
PGPORT="5432"
PORT="3000"
GOOGLE_CLIENT_ID="***" # ID de credencial criado no GCP
COOKIE_SECRET="***" # Hash para gerar cookie
```

### MQTT API: aplicação Node.js

Serviço API, `/etc/systemd/system/mqtt.service`:

```ini
[Unit]
Description=Feira de jogos
Documentation=https://github.com/feira-de-jogos/nuvem
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node assinante.js
WorkingDirectory=/opt/github/feira-de-jogos/nuvem/mqtt
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Arquivo `.env` do repositório `mqtt-api`:

```ini
MQTT_URI="mqtt://feira:feira@feira-de-jogos.sj.ifsc.edu.br"
PGDATABASE="feira"
PGPASSWORD="feira"
PGHOST="localhost"
PGUSER="feira"
PGPORT="5432"
```
