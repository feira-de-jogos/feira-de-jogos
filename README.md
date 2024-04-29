# Economia

## Sistema Econômico

1. A moeda **Tijolinho** (**$TJL**) é 100% digital e sem fins lucrativos.
2. A moeda deve ser implementada e gerida em servidor próprio.
3. Definir formas de ganhos de valores da moeda (jogos, bônus, premiação, bingo, transferência).
4. Recomendar a definição de parâmetros (quantitativos e qualitativos) sobre a forma correta (e lícita) de utilização da moeda: (compra, doação, pagamento, penalidades, empréstimo, transferência, PIX?).
5. Estabelecer valor mínimo e máximo por transações, bem como o valor de referência.
6. Delinear as interações entre os usuários e visualização dos _ranks_ local e global.
7. Estabelecer as formas de consultas de extratos da conta individual e o prazo de validade dos valores.

**Objetivo:** Interagir com os jogos desenvolvidos pelos alunos no semestre atual! (e do anterior?)

**Recompensas:** Ganhar $TJL durante a jornada!

**Métricas:**
- Até $TJL +100 (1a tentativa);
- Até $TJL -20 (2a-5a tentativa);
- Até $TJL +10 (6a a 10a tentativa);
- Mín: até $TJL +10 (por jogo);
- Max: até $TJL +350 (por jogo);
- Bônus: até $TJL +10 (por jogo inédito).

## Integração entre Jogos e Banco

**Requisitos:**
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

O acesso é padronizado para microprocessados (aplicações Web) e microcontrolados, baseado em REST API + JSON, uma vez que o sentido das mensagens é, basicamente, do cliente para o servidor.

As aplicações a serem desenvolvidas ao longo do projeto são:
- **Cadastro:** cadastro e manutenção de conta de usuário;
- **Banco:** operador financeiro, o banco do sistema econômico.

![Diagrama de blocos dos serviços e seus protocolos](mermaid-diagram.png)

## REST API

**Duas versões previstas:**
1. Versão 1.0 (`v1`), de 2023;
2. Versão 2.0 (`v2`), pós 2023.

### API v1

**Implementação simples, com autenticação embutida no corpo da requisição.**


#### Operações de jogador:

**Autenticação do jogador:**
- **Método:** POST
- **Path:** `/autenticacao`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Operação iniciada pela tela inicial do aplicativo do usuário, com autenticação via Google OAuth 2.0.
- **Entrada:** Requisição HTTP POST com o seguinte corpo:
  - `credential`: Token de identificação fornecido pelo Google Sign-In.
- **Respostas:**
  - **302: Found** - Redireciona para `/api/v1/extrato` em caso de sucesso na autenticação.
  - **500: Internal Server Error** - Erro interno no servidor.

**Extrato de jogador:**
- **Método:** GET
- **Path:** `/extrato`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:**
  - Operação que retorna a página HTML do extrato financeiro do jogador. A requisição deve ser feita via GET e ser autenticada usando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com o extrato do jogador.
  - **401: Unauthorized** - Redireciona para a tela de autenticação em caso de falha na autenticação.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Pix entre jogadores:**
- **Método:** GET
- **Path:** `/pix`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:**
  - Operação que retorna a página HTML para realizar uma transação Pix entre jogadores. A requisição deve ser feita via GET e ser autenticada usando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com o formulário para realizar uma transação Pix.
  - **302: Redirecionamento** - Em caso de autenticação bem-sucedida.
  - **401: Unauthorized** - Redireciona para a tela de autenticação em caso de falha na autenticação.
  - **404: Usuário não encontrado** - Retorna um JSON com `{ result: 1, message: 'Usuário não encontrado' }`.
  - **403: Saldo Insuficiente** - Retorna um JSON com `{ result: 2, message: 'Saldo Insuficiente' }`.
  - **400: Não é possível enviar um Pix para você mesmo!** - Retorna um JSON com `{ result: 3, message: 'Não é possível enviar um Pix para você mesmo!' }`.
  - **400: Valor abaixo de 1 tijolinho** - Retorna um JSON com `{ result: 4, message: 'Você não pode enviar um valor abaixo de 1 tijolinho' }`.
  - **200: Pix enviado com sucesso!** - Retorna um JSON com `{ result: 5, message: 'Pix enviado com sucesso!' }`.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Crédito para jogador:**
- **Método:** POST
- **Path:** `/credito`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Realiza uma operação de crédito para um jogador específico.
- **Parâmetros:**
  - `id` (Identificador do jogador)
  - `senha` (Senha do jogador)
  - `jogo` (Identificador do jogo)
  - `valor` (Valor da operação em tijolinhos)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Débito para jogador:**
- **Método:** POST
- **Path:** `/debito`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** O corpo da requisição deve ser em JSON.
- **Parâmetros:**
  - `id` (Identificador do jogador)
  - `senha` (Senha do jogador)
  - `maquina` (Identificador da máquina)
  - `produto` (Identificador do produto)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **402: Pagamento não autorizado** - Saldo Insuficiente
  - **403: Forbidden** - Produto inexistente ou sem estoque.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.
    
**Conta do jogador:**
- **Método:** POST
- **Path:** `/conta`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza informações da conta do jogador, permitindo visualizar e modificar dados como nome, ID, senha e saldo. A requisição deve ser autenticada utilizando o token fornecido durante a autenticação via Google OAuth 2.0. O corpo da requisição deve ser em JSON.
- **Parâmetros:**
  - `idNumero` (Identificador do jogador)
  - `novaSenha` (Nova senha para atualização)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválido ou senhas não coincidem.
  - **401: Unauthorized** - Autenticação inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização da senha.


### Operações de administrador:

#### Atualizar Informações da Conta do Jogador:

- **Método:** GET
- **Path:** `/adm`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Recupera informações de um jogador com perfil de administrador. A requisição deve ser autenticada utilizando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com informações e funcionalidades para administradores.
  - **302: Found** - Redireciona para a página de login se o usuário não estiver autenticado.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante o processamento.

#### Atualizar Estoque do Produto

- **Método:** POST
- **Path:** `/atualizar-estoque`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza o estoque de um produto. Requer autenticação de administrador e fornece informações como o ID do produto e a quantidade a ser atualizada.
- **Parâmetros:**
  - `productIdE` (ID do produto)
  - `amountE` (Quantidade a ser atualizada no estoque)
  - `idNumero` (Identificador do administrador)
- **Respostas:**
  - **200: OK** - Estoque atualizado com sucesso.
  - **400: Bad Request** - Produto não encontrado, tentativa de alterar o estoque do Pix ou quantidade negativa.
  - **401: Unauthorized** - Autenticação de administrador inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização do estoque.

#### Atualizar Valor do Produto

- **Método:** POST
- **Path:** `/atualizar-valor`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza o valor de um produto. Requer autenticação de administrador e fornece informações como o ID do produto e a quantidade a ser atualizada.
- **Parâmetros:**
  - `productIdV` (ID do produto)
  - `amountV` (Novo valor do produto)
  - `idNumero` (Identificador do administrador)
- **Respostas:**
  - **200: OK** - Valor do produto atualizado com sucesso.
  - **400: Bad Request** - Produto não encontrado, tentativa de alterar o valor do Pix ou valor negativo.
  - **401: Unauthorized** - Autenticação de administrador inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização do valor do produto.

### Operação de máquina:

#### Estoque de máquina:
- **Método:** POST
- **Path:** /estoque
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Operação para verificar o estoque da máquina.
- **Parâmetros:**
  - `id` (Identificador da máquina)
  - `senha` (Senha atribuída a máquina)
  - `produto` (Identificador do produto)
  - `quantidade` (Quantidade atualizada do produto)
- **Respostas:**
  - **200: OK** - Retorna JSON com o estoque corrente da máquina.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **403: Forbidden** - Operação inválida: produto não existe ou não pode ser estocado nessa máquina.

# Serviços em nuvem

## Banco de dados relacional

Escolhido o banco de dados relacional pelas ligações entre a moeda corrente, produtos e serviços.

### Versão 2

O banco está assim modelado (copiado do [original](https://drawsql.app/teams/feira-de-jogos/diagrams/feira-de-jogos-v2)):

![Modelagem do banco de dados, versão 2.](feira-de-jogos-v2.png)

Para PostgreSQL, o código fica assim:

```psql
CREATE TABLE "pessoas"(
    "id" SERIAL NOT NULL,
    "operador" BOOLEAN NOT NULL DEFAULT '0',
    "nome" TEXT NOT NULL,
    "senha" TEXT NULL,
    "email" TEXT NOT NULL
);
ALTER TABLE
    "pessoas" ADD PRIMARY KEY("id");
ALTER TABLE
    "pessoas" ADD CONSTRAINT "pessoas_email_unique" UNIQUE("email");
CREATE TABLE "maquinas"(
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NULL,
    "local" TEXT NULL,
    "ocupada" BOOLEAN NOT NULL DEFAULT '0'
);
ALTER TABLE
    "maquinas" ADD PRIMARY KEY("id");
CREATE TABLE "operacoes"(
    "id" INTEGER NOT NULL,
    "origem" INTEGER NOT NULL,
    "destino" INTEGER NOT NULL,
    "produto" INTEGER NULL,
    "valor" INTEGER NOT NULL DEFAULT '0',
    "data" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "2fa" SMALLINT NULL,
        "concluida" BOOLEAN NOT NULL DEFAULT '0'
);
ALTER TABLE
    "operacoes" ADD PRIMARY KEY("id");
CREATE TABLE "estoque"(
    "id" SERIAL NOT NULL,
    "maquina" INTEGER NOT NULL,
    "produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT '0'
);
ALTER TABLE
    "estoque" ADD PRIMARY KEY("id");
CREATE TABLE "produtos"(
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NULL,
    "url" TEXT NULL,
    "valor" INTEGER NOT NULL DEFAULT '0'
);
ALTER TABLE
    "produtos" ADD PRIMARY KEY("id");
ALTER TABLE
    "estoque" ADD CONSTRAINT "estoque_produto_foreign" FOREIGN KEY("produto") REFERENCES "produtos"("id");
ALTER TABLE
    "operacoes" ADD CONSTRAINT "operacoes_origem_foreign" FOREIGN KEY("origem") REFERENCES "pessoas"("id");
ALTER TABLE
    "operacoes" ADD CONSTRAINT "operacoes_produto_foreign" FOREIGN KEY("produto") REFERENCES "produtos"("id");
ALTER TABLE
    "estoque" ADD CONSTRAINT "estoque_maquina_foreign" FOREIGN KEY("maquina") REFERENCES "maquinas"("id");
ALTER TABLE
    "operacoes" ADD CONSTRAINT "operacoes_destino_foreign" FOREIGN KEY("destino") REFERENCES "pessoas"("id");
```

### Versão 1 (legado)

O banco foi assim modelado (copiado do [original](https://drawsql.app/teams/feira-de-jogos/diagrams/feira-de-jogos-v1)):

![Modelagem do banco de dados, versão 1.](feira-de-jogos-v1.png)

Para PostgreSQL, o código ficou assim:

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
## Interação do Usuário com o Sistema

### 1. **Jogando Jogos e Recebendo Tijolinhos:**
   - O usuário inicia sua jornada jogando os jogos disponíveis.
   - Após cada jogo, insere seu ID e senha obtidos do banco na interface do jogo.
   - **Frontend do Jogo -> API (POST /credito) -> Banco de Dados (Atualização de Saldo) -> Frontend do Jogo**
   - O usuário recebe tijolinhos como recompensa pela participação.

### 2. **Consultando Extrato Financeiro:**
   - O usuário pode consultar seu extrato financeiro para visualizar ganhos e transações.
   - **Frontend do Usuário -> API (GET /extrato) -> Banco de Dados (Consulta de Extrato) -> Frontend do Usuário**

### 3. **Realizando PIX entre Jogadores:**
   - O usuário decide fazer um PIX para outro jogador.
   - **Frontend do Usuário -> API (GET /pix) -> Banco de Dados (Verificação e Atualização de Saldo) -> Frontend do Usuário**
   - O PIX é concluído, e os saldos são atualizados.

### 4. **Comprando Produtos no Dispenser:**
   - O usuário escolhe um produto no dispenser de alimentos.
   - Insere seu ID e senha na máquina para autenticação.
   - **Máquina -> API (POST /debito) -> Banco de Dados (Verificação e Atualização de Saldo) -> Máquina**
   - Se tiver saldo suficiente, o dispenser ejeta o alimento e o saldo é debitado.

### 5. **Atualizando Informações da Conta:**
   - O usuário pode atualizar informações da sua conta.
   - **Frontend do Usuário -> API (POST /conta) -> Banco de Dados (Atualização de Informações) -> Frontend do Usuário**
   - Por exemplo, alterar a senha.

### 6. **Administração do Sistema:**
   - Administradores podem acessar informações e funcionalidades específicas.
   - **Frontend do Administrador -> API (GET /adm) -> Banco de Dados (Consulta de Informações) -> Frontend do Administrador**
   - Atualizar estoque de produtos, informações da conta do jogador, etc.

### 7. **Atualizando Estoque de Produtos:**
   - Administradores podem atualizar o estoque de produtos.
   - **Frontend do Administrador -> API (POST /atualizar-estoque) -> Banco de Dados (Atualização de Estoque) -> Frontend do Administrador**

### 8. **Atualizando Valor de Produtos:**
   - Administradores podem atualizar o valor de produtos.
   - **Frontend do Administrador -> API (POST /atualizar-valor) -> Banco de Dados (Atualização de Valor) -> Frontend do Administrador**

### 9. **Integração com MQTT para Dispenser de Alimentos:**
   - A comunicação entre a API e o dispenser de alimentos ocorre via MQTT.
   - **API (MQTT Publish) -> Broker MQTT -> Dispenser (MQTT Subscribe)**



## Funcionamento Prático

![Diagrama do funcionamento da feira](infografico.jpg)

### 1. Cadastro e Autenticação
- O usuário cria uma conta no [Banco digital para feira de jogos](https://feira-de-jogos.sj.ifsc.edu.br).
- Ao iniciar a jornada, autentica-se nos jogos usando o sistema de autenticação via Google OAuth 2.0.

### 2. Interagindo com Jogos
- O usuário joga os jogos desenvolvidos pela 8ª fase de telecomunicações.
- Ao finalizar cada jogo, insere seu ID e senha obtidos do banco para receber tijolinhos.

### 3. Recompensas e Economia
- O usuário ganha tijolinhos como recompensa pela participação nos jogos.
- Pode consultar seu extrato financeiro para acompanhar ganhos e transações.

### 4. Gastos e Transações
- Utiliza os tijolinhos para diversas atividades econômicas, como fazer PIX entre jogadores.
- Realiza transações PIX para responsáveis de máquinas de jogos retro, possibilitando a continuação da jornada.

### 5. Dispenser de Alimentos
- Acesso ao dispenser de alimentos inserindo ID e senha.
- Se tiver saldo suficiente, o dispenser ejeta o alimento desejado usando uma mola.
- O saldo é debitado automaticamente do usuário.

### 6. Consultas e Atualizações da Conta
- O usuário pode consultar e atualizar informações da sua conta usando operações como `/extrato`, `/pix`, `/credito`, `/debito`, `/conta`.

### 7. Integração com MQTT
- A comunicação entre a aplicação e o dispenser de alimentos ocorre via MQTT, garantindo sincronização e comunicação bidirecional.

### 8. Serviços em Nuvem
- Utilização de um banco de dados relacional PostgreSQL para armazenar informações sobre jogadores, jogos, transações, produtos, entre outros.
- Serviços em nuvem, como MQTT para comunicação com dispositivos físicos e NGINX para gerenciar o tráfego da API.

### 9. Segurança
- Autenticação segura via OAuth 2.0 para acesso à API.
- Utilização de certificados SSL/TLS para proteger a comunicação entre o cliente e o servidor.

### 10. Ambiente do Servidor
- Configuração de variáveis de ambiente para diferentes serviços.
- Uso do Systemd para gerenciar os serviços da API e MQTT.

### 11. Diagrama de Blocos
- Visualização da arquitetura de serviços e protocolos por meio de um [diagrama de blocos](mermaid-diagram-2023-11-06-234505.png).

### 12. Atualizações do Sistema
- Possibilidade de atualização para a API (v2) pós-2023, conforme previsto.
- Atualizações do banco de dados relacional conforme necessário para manter a integridade e escalabilidade do sistema.
