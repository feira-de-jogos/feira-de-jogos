# Versão 2

Implementação baseada em [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) e [JWT](https://datatracker.ietf.org/doc/html/rfc7519).

## Requisitos do sistema

Requisitos funcionais:

1. O sistema deve possuir acesso a partir de qualquer endereço IPv4 ou IPv6.
1. O sistema deve atender a requisições pela Internet via padrões REST API sobre HTTPS.
1. O sistema deve prever uma interface de usuário para cadastro e manutenção da sua conta.
1. A autenticação de usuário, incluindo o cadastro, deve ser feito via [O Auth 2.0](https://oauth.net/2/).
1. O sistema deve possuir um banco de dados central para persistência dos dados.
1. O sistema deve prever mecanismos de sincronização bidirecional para a sincronização dos dados do banco central e terminais.
1. O banco de dados deve armazenar dados de usuário, dispositivos terminais e produtos para venda.

Requisitos não funcionais:

1. O sistema deve ter suporte a escalabilidade para atender a picos momentâneos de demanda.

O acesso é padronizado para microprocessados (aplicações Web) e microcontrolados, baseado em REST API + JSON, uma vez que o sentido das mensagens é, basicamente, do cliente para o servidor.

As aplicações a serem desenvolvidas ao longo do projeto são:

- **Cadastro**: cadastro e manutenção de conta de usuário;
- **Banco**: operador financeiro, o banco do sistema econômico.

## Trocas de Mensagens e Fluxogramas

### Autenticação via O Auth 2.0

Entre as aplicações em rede:

```mermaid
sequenceDiagram
  Usuário ->>+ Servidor Web: solicita login
  Servidor Web ->>+ Google: redireciona login
  Google ->>+ Usuário: solitica permissão
  Usuário ->>- Google: concede permissão
  Google ->>- Servidor Web: gera código de autorização
  Servidor Web ->>+ Google: troca código por token de acesso
  Google ->>- Servidor Web: gera JWT
  Servidor Web ->>- Usuário: retorna JWT
```

## Operação de crédito

Entre as aplicações em rede:

```mermaid
sequenceDiagram
  Usuário ->>+ Servidor Web: envia POST /credit
  Servidor Web ->>+ Banco de Dados: DQL SQL
  Banco de Dados ->>- Servidor Web: resposta do DQL
  Servidor Web -->+ Banco de Dados: DML SQL
  Banco de Dados -->- Servidor Web: resposta do DML
  Servidor Web ->>- Usuário: resposta do POST
``` 

Fluxo de escolha do servidor Web na resposta à requisição do usuário:

```mermaid
flowchart TD
  A[Usuário envia POST /credit]
  B
  C
  D[Retorna 401]
  E
  F[Retorna 400]
  G
  H[Retorna 402]
  I[Retorna 403]
  J[Consulta operações\nrecentes no BD]
  K
  L[Retorna 429]
  M[Insere operação de\ncrédito no BD]
  N[Retorna 200]

  A --> B{JWT\nválido?}
  B -->|Sim| C{Requisição\nbem\nformatada?}
  B -->|Não| D
  C --> |Sim| E{Valor\nsolicitado\né inteiro\nnatural?}
  C --> |Não| F
  E --> |Sim| G{Valor\nacima do\nlimite?}
  E --> |Não| H
  G --> |Sim| I
  G --> |Não| J
  J --> K{Existe\ncrédito\nrecente?}
  K --> |Sim| L
  K --> |Não| M
  M --> N
```

### Operação de débito

```mermaid
sequenceDiagram
  Usuário ->>+ Servidor Web: envia POST /debit
  Servidor Web ->>+ Banco de Dados: DQL SQL
  Banco de Dados ->>- Servidor Web: resposta do DQL
  Servidor Web -->+ Banco de Dados: DML SQL
  Banco de Dados -->- Servidor Web: resposta do DML
  Servidor Web ->>- Usuário: resposta do POST
```

Fluxo de escolha do servidor Web na resposta à requisição do usuário:

```mermaid
flowchart TD
  A[Usuário envia POST /debit]
  B
  C
  D[Retorna 401]
  E[Consulta operações\nrecentes no BD]
  F[Retorna 400]
  G
  H[Retorna 429]
  I
  J[Consulta estoque\ndo produto no BD]
  K[Insere operação de\ndébito no BD]
  L
  M[Retorna 403]
  N[Retorna 200]

  A --> B{JWT\nválido?}
  B -->|Sim| C{Requisição\nbem\nformatada?}
  B -->|Não| D
  C --> |Sim| E
  C --> |Não| F
  E --> G{Existe\ndébito\nrecente?}
  G --> |Sim| H
  G --> |Não| I{Produto\nfísico ou\ndigital?}
  I --> |Físico| J
  I --> |Digital| K
  J --> L{Produto em\nestoque?}
  L --> |Sim| K
  L --> |Não| M
  K --> N
```
### Operação de transferência

```mermaid
sequenceDiagram
  Usuário ->>+ Servidor Web: envia POST /transfer
  Servidor Web ->>+ Banco de Dados: DQL SQL
  Banco de Dados ->>- Servidor Web: resposta do DQL
  Servidor Web -->+ Banco de Dados: DML SQL
  Banco de Dados -->- Servidor Web: resposta do DML
  Servidor Web ->>- Usuário: resposta do POST
```

Fluxo de escolha do servidor Web na resposta à requisição do usuário:

```mermaid
flowchart TD
  A[Usuário envia POST /transfer]
  B
  C
  D[Retorna 401]
  E[Consulta saldo\ndo usuário no BD]
  F
  G[Consulta operações\nrecentes no BD]
  H[Retorna 403]
  I
  J[Retorna 429]
  K[Insere operação de\n  transferência no BD]
  L[Retorna 200]
  M[Retorna 400]
  N[Retorna 402]
  O[Retorna 429]

  A --> B{JWT\nválido?}
  B -->|Sim| C{Requisição\nbem\nformatada?}
  B -->|Não| D
  C --> |Sim| E
  C --> |Não| M
  E --> F{Usuário tem\nsaldo suficiente?}
  F --> |Sim| I{Valor de\ntransferência\nválido?}
  F --> |Não| N
  I --> |Sim| G
  I --> |Não| H
  G --> J{Existe\n  transferência\nrecente?}
  J --> |Sim| O
  J --> |Não| K
  K --> L
```

### Interação com Máquina de Vendas

```mermaid
sequenceDiagram
  box Máquina
    participant Máquina-Engine
    participant Máquina-Unity
  end
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end
  actor Pessoa

  Máquina-Unity ->>+ Servidor Web: GET /ws
  Servidor Web -->> Máquina-Unity: 101 Switching Protocols
  Máquina-Unity ->> Servidor Web: { "state": "idle" }

  Pessoa ->>+ Servidor Web: POST /login
  Servidor Web ->>- Pessoa: 200 OK
  
  Pessoa ->>+ Servidor Web: POST /debit
  Servidor Web ->>- Pessoa: 200 OK

  Servidor Web  ->>+ Máquina-Unity: { "state": "2fa", "pessoa": "First name", "code": 86, "operation": 1000 }
  Máquina-Unity ->>- Servidor Web: { "state": "2fa", "operation": 1000 }

  Pessoa ->>+ Servidor Web: POST /2fa
  Servidor Web ->>- Pessoa: 200 OK

  Servidor Web ->>+ Máquina-Unity : { "state": "releasing", "product": 1, "operation": 1000 }
  Máquina-Unity ->>- Servidor Web: { "state": "releasing", "operation": 1000 }

  Máquina-Unity ->>+ Máquina-Engine: POST /engine
  loop
    Máquina-Engine -->> Máquina-Unity: 100 Continue
  end
  Máquina-Engine ->>- Máquina-Unity: 200 OK

  Máquina-Unity ->> Servidor Web: { "state": "idle" }

  Servidor Web ->>+ Banco de Dados: SQL DML: atualizar estoque e operação concluída
  Banco de Dados ->>- Servidor Web: SQL DML: banco atualizado

  Servidor Web ->>- Máquina-Unity: 200 OK
```

## REST API

A REST API está definida no arquivo [rest-api.yaml](rest-api.yaml) em formato [OpenAPI 3.0](https://swagger.io/specification/v3/).

## Banco de dados relacional

O banco está assim modelado (copiado do [original](https://drawsql.app/teams/feira-de-jogos/diagrams/feira-de-jogos-v2)):

![Modelagem do banco de dados, versão 2.](feira-de-jogos.png)

Para PostgreSQL, os comandos DDL estão no arquivo [ddl.sql](ddl.sql).
Já os comandos DML estão no arquivo [dml.sql](dml.sql).
