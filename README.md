# Economia

Sobre o sistema econômico:

1. A moeda **tijolinho** (**$TJL**) é 100% digital e sem fins lucrativos.
2. A moeda deve ser implementada e gerida em servidor próprio.
3. Deve-se estabelecer as formas de ganhos de valores da moeda (jogos, bônus, premiação, bingo, transferência).
4. Recomenda-se a definição de parâmetros (quantitativos e qualitativos) sobre a forma correta (e lícita) de utilização da moeda: (compra, doação, pagamento, penalidades, empréstimo, transferência, promoção, PIX?).
5. Estabelecer valor mínimo e máximo por transações, bem como o valor de referência.
6. Delinear as interações entre os usuários e visualização dos _ranks_ local e global.
7. Estabelecer as formas de consultas de extratos da conta individual e o prazo de validade dos valores.

Objetivo: Interagir com os jogos desenvolvidos pelos alunos no semestre atual! (e do anterior?)

Recompensas: Ganhar $TJL durante a jornada!

Métricas:

1. Até $TJL +100 (1a tentativa);
2. Até $TJL -20 (2a-5a tentativa);
3. Até $TJL +10 (6a a 10a tentativa);
4. Mín: até $TJL +10 (por jogo);
5. Max: até $TJL +350 (por jogo);
6. Bônus: até $TJL +10 (por jogo inédito).

# Integração entre jogos e banco

Os requisitos são os seguintes:

1. O sistema deve possuir acesso a partir de qualquer endereço IPv4 ou IPv6.
2. O sistema deve atender a requisições pela Internet via padrões REST API sobre HTTPS.
3. O sistema deve prever uma interface de usuário para cadastro e manutenção da sua conta.
4. O cadastro de usuário deve ser feito com mecanismo externo de validação de email, como por exemplo [OAuth](https://oauth.net/2/), e posterior preenchimento dos demais dados, como por exemplo apelido e senha.
5. O sistema deve ter suporte a escalabilidade para atender a picos momentâneos de demanda.
6. O sistema deve possuir um banco de dados central, que pode, caso necessário, ser replicado no todo ou em parte nos dispositivos terminais para eventualidades de falha de conectividade.
7. O sistema deve prever mecanismos de sincronização bidirecional para a sincronização dos dados do banco central e terminais.
8. O banco de dados deve armazenar dados de usuário, dispositivos terminais (quando necessário) e produtos para venda.
9. Todos os dados armazenados no banco (usuários e senhas, dispositivos terminais e produtos para venda) devem ter padrão numérico de 4 dígitos.
10. O sistema deve permitir o acesso remoto aos dados de usuários nos dispositivos terminais mediante autenticação externa de email ou o par usuário + senha.
11. Aplicações Web podem usar ambos os mecanismos de autenticação (externa por email e par usuário+senha).
12. Dispositivos terminais microcontrolados devem possuir teclado numérico aparente para o preenchimento de usuário e senha numéricos e, assim, autenticar o usuário para realizar as operações na máquina local.

O acesso é padronizado para microprocessados (aplicações Web) e microcontrolados, baseado em REST API + JSON, uma vez que o sentido das mensagens é, basicamente, do cliente para o servidor. As aplicações a serem desenvolvidas ao longo do projeto são:

* Cadastro: cadastro e manutenção de conta de usuário;
* Banco: operador financeiro, o banco do sistema econômico.



<figure><img src=".gitbook/assets/mermaid-diagram-2023-11-06-234505.png" alt="Diagrama de blocos dos serviços e seus protocolos"><figcaption><p>Diagrama de blocos dos serviços e seus protocolos</p></figcaption></figure>

## REST API

Duas versões previstas:

1. Versão 1.0 (`v1`), de 2023;
2. Versão 2.0 (`v2`), pós 2023.

### API v1

Implementação simples, com autenticação embutida no corpo da requisição.

#### Operações de jogador:

{% swagger method="post" path="/extrato" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Extrato de jogador" %}
{% swagger-description %}
Operação iniciada pela tela inicial do aplicativo do usuário, com autenticação via Google OAuth 2.0.
{% endswagger-description %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com lista de débitos e créditos.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/credito" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Crédito para jogador" %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" name="id" %}
Identificador do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="jogo" type="" required="true" %}
Identificador do jogo.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" required="true" %}
Valor da operação em tijolinhos.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com resultado da operação.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação não é possível por falta de recursos no banco.
{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/debito" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Débito para jogador" %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" name="id" %}
Identificador do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="maquina" required="true" %}
Identificador da máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="produto" required="true" %}
Identificador do produto.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" required="true" %}
Valor do produto em tijolinhos.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com resultado da operação.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação de crédito não é possível por falta de recursos do jogador.
{% endswagger-response %}
{% endswagger %}

#### Operação de máquina:

{% swagger method="post" path="/estoque" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Estoque de máquina" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="id" required="true" %}
Identificador da máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha atribuída a máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="produto" required="false" %}
Identificador do produto.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="quantidade" required="false" %}
Quantidade atualizada do produto.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com o estoque corrente da máquina.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação inválida: produto não existe ou não pode ser estocado nessa máquina.
{% endswagger-response %}
{% endswagger %}

# Serviços em nuvem

## Banco de dados relacional

Escolhido o banco de dados relacional pelas ligações entre a moeda corrente, produtos e serviços.

O banco está assim modelado:

<figure><img src=".gitbook/assets/drawSQL-dados-centrais-export-2023-10-17.png" alt=""><figcaption><p>Modelagem do banco de dados relacional. Fonte: <a href="https://drawsql.app/teams/feira-de-jogos/diagrams/dados-centrais">https://drawsql.app/teams/feira-de-jogos/diagrams/dados-centrais</a>.</p></figcaption></figure>

Para PostgreSQL, o código fica assim:

```plsql
CREATE TABLE "maquinas"(
    "id" smallserial NOT NULL,
    "senha" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL
);
ALTER TABLE
    "maquinas" ADD PRIMARY KEY("id");
CREATE TABLE "receitas"(
    "id" SERIAL NOT NULL,
    "jogador_id" SMALLINT NOT NULL,
    "jogo_id" SMALLINT NOT NULL,
    "valor" SMALLINT NOT NULL,
    "data" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "receitas" ADD PRIMARY KEY("id");
CREATE TABLE "despesas"(
    "id" SERIAL NOT NULL,
    "jogador_id" SMALLINT NOT NULL,
    "produto_id" SMALLINT NOT NULL,
    "valor" SMALLINT NOT NULL,
    "data" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "despesas" ADD PRIMARY KEY("id");
CREATE TABLE "produtos"(
    "id" smallserial NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" SMALLINT NOT NULL
);
ALTER TABLE
    "produtos" ADD PRIMARY KEY("id");
CREATE TABLE "estoque"(
    "id" smallserial NOT NULL,
    "maquina_id" SMALLINT NOT NULL,
    "produto_id" SMALLINT NOT NULL,
    "quantidade" SMALLINT NOT NULL
);
ALTER TABLE
    "estoque" ADD PRIMARY KEY("id");
CREATE TABLE "jogos"(
    "id" smallserial NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL
);
ALTER TABLE
    "jogos" ADD PRIMARY KEY("id");
CREATE TABLE "jogadores"(
    "id" smallserial NOT NULL,
    "senha" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "email" TEXT NULL
);
CREATE INDEX "jogadores_email_index" ON
    "jogadores"("email");
ALTER TABLE
    "jogadores" ADD PRIMARY KEY("id");
ALTER TABLE
    "despesas" ADD CONSTRAINT "despesas_produto_id_foreign" FOREIGN KEY("produto_id") REFERENCES "produtos"("id");
ALTER TABLE
    "receitas" ADD CONSTRAINT "receitas_jogo_id_foreign" FOREIGN KEY("jogo_id") REFERENCES "jogos"("id");
ALTER TABLE
    "estoque" ADD CONSTRAINT "estoque_produto_id_foreign" FOREIGN KEY("produto_id") REFERENCES "produtos"("id");
ALTER TABLE
    "estoque" ADD CONSTRAINT "estoque_maquina_id_foreign" FOREIGN KEY("maquina_id") REFERENCES "maquinas"("id");
ALTER TABLE
    "despesas" ADD CONSTRAINT "despesas_jogador_id_foreign" FOREIGN KEY("jogador_id") REFERENCES "jogadores"("id");
ALTER TABLE
    "receitas" ADD CONSTRAINT "receitas_jogador_id_foreign" FOREIGN KEY("jogador_id") REFERENCES "jogadores"("id");
```

# Preparação do ambiente do servidor

## Arquivos

### Variáveis de ambiente

Arquivo `.env` do repositório `rest-api`:

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

Arquivo `.env` do repositório `mqtt-api`:

```ini
MQTT_URI="mqtt://feira:feira@feira-de-jogos.sj.ifsc.edu.br"
PGDATABASE="feira"
PGPASSWORD="feira"
PGHOST="localhost"
PGUSER="feira"
PGPORT="5432"
```

### Serviços em rede

_Site_ padrão do NGINX, `/etc/nginx/sites-enabled/default`:

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

### Serviços adicionados ao Systemd

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
