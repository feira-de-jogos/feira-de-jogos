# Serviços

Há serviços em operação na nuvem e nas máquinas (de vendas e fliperamas).

## Nuvem

Na primeira versão do ambiente, os serviços eram gerenciados pelo `systemd`.

Na segunda versão, a mais atual, é usado o Docker Compose. Os serviços são configurados e iniciados no repositório [`rest-api`](https://github.com/feira-de-jogos/rest-api). 

Para rodar o ambiente, é preciso criar o arquivo `.env`, no diretório raiz daquele repositório, com o seguinte conteúdo:

- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`: acesso ao banco de dados relacional.
- `PORT`: porta interna da REST API.
- `GOOGLE_CLIENT_ID`: ID(s) da(s) aplicação(ões) que consultam a REST API.
- `GOOGLE_CLIENT_ID_GAMES`: IDs dos jogos dos alunos.
- `TOKEN_SECRET_KEY_ARCADE`, `TOKEN_SECRET_KEY_VENDING_MACHINE`: chaves simétricas dos tokens JWT das máquinas.

E então, rodar o comando:

```bash
make
```

Uma vez a o sistema em operação, deve-se cadastrar os usuários TURN `adcieqipt20241` e `adcipt20242` no coturn com o comando:

```sh
docker exec -it nuvem-redis-1 redis-cli
```

e, uma vez dentro do CLI do Redis:

```redis
# Fonte: https://github.com/coturn/coturn/blob/master/turndb/schema.userdb.redis
#
# A chave é o MD5 de "<usuário>:<realm>:<senha>".
# Logo, a senha é gerada com o comando: "echo -n "adcieqipt20241:feira-de-jogos.dev.br:adcieqipt20241" | md5sum

set turn/realm/feira-de-jogos.dev.br/user/adcieqipt20241/key "6e6aa4257ae2c25c98f4a0fba10d060b"
set turn/realm/feira-de-jogos.dev.br/user/adcipt20242/key "2497504be47882984ac53f7d41758887"
persist turn/realm/feira-de-jogos.dev.br/user/adcieqipt20241/key
persist turn/realm/feira-de-jogos.dev.br/user/adcipt20242/key
save
```

Atualmente, o ambiente é acessível em: https://feira-de-jogos.dev.br.

## Máquinas

As aplicações das máquinas de vendas e fliperamas são feitas em Python. Como todas as máquinas são Linux, é usado o systemd para gerenciar os serviços. Mais especificamente, a máquina de vendas roda em [Raspberry Pi 3B+](https://www.raspberrypi.com/products/raspberry-pi-3-model-b-plus/) com [Raspberry Pi OS Lite 64-bit](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-64-bit), enquanto os fliperamas rodam em [Orange Pi PC Plus](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-PC-Plus.html) com [ReARM.it para Orange Pi PC](https://rearm.it/download.html). 

Em todos os casos, o usuário padrão do sistema é `pi` e adotou-se o diretório `/opt/github/feira-de-jogos/equipamentos` para clonar o repositório [equipamentos](https://github.com/feira-de-jogos/equipamentos) com todo o código necessário.

O primeiro passo, comum a todas as máquinas, é criar um ambiente virtual e instalar as dependências. No diretório raiz do código:

```sh
sudo mkdir -p /opt/github/feira-de-jogos
sudo chown pi /opt/github/feira-de-jogos
cd /opt/github/feira-de-jogos
git clone https://github.com/feira-de-jogos/equipamentos
cd equipamentos
sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

### Máquina de Vendas

Na máquina, o primeiro comando específico é a instalação de dependências:

```sh
pip install -r vending-machine/requirements.txt
```

Depois, criar arquivo `.env` com o seguinte conteúdo:

```ini
TOKEN_SECRET_KEY_VENDING_MACHINE=<chave>
```

onde `<chave>` é a chave simétrica do JWT.

Com isso, pode-se definir o serviço em `/etc/systemd/system/vending-machine.service`:

```ini
[Unit]
Description=Vending machine
After=network.service

[Service]
WorkingDirectory=/opt/github/feira-de-jogos/equipamentos
ExecStart=/opt/github/feira-de-jogos/equipamentos/venv/bin/python vending-machine/wss-client.py
User=pi
Restart=always

[Install]
WantedBy=multi-user.target
```

e ativá-lo com os comandos:

```sh
sudo systemctl daemon-reload
sudo systemctl enable vending-machine.service
sudo systemctl start vending-machine.service
```

### Fliperama (*arcade*)

Assim como a máquina de vendas, deve-se instalar as dependências:

```sh
pip install -r arcade/requirements.txt
```

E, depois,  definir a chave JWT no arquivo `.env` com o seguinte formato:

```ini
TOKEN_SECRET_KEY_ARCADE=<chave>
```
onde `<chave>` deve ser substituído pelo valor equivalente ao do servidor.

Na sequência, pode-se criar o serviço no systemd com o arquivo `/etc/systemd/system/arcade.service`:

```ini
[Unit]
Description=Arcade
After=network.service

[Service]
WorkingDirectory=/opt/github/feira-de-jogos/equipamentos
ExecStart=/opt/github/feira-de-jogos/equipamentos/venv/bin/python arcade/client.py
User=pi
Restart=always

[Install]
WantedBy=multi-user.target
```

e ativar o novo serviço com os comandos:

```sh
sudo systemctl daemon-reload
sudo systemctl enable arcade.service
sudo systemctl start arcade.service
```
