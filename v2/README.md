# Versão 2

Implementação baseada em [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) e [JWT](https://datatracker.ietf.org/doc/html/rfc7519).

O código está distribuído em vários repositórios:

- [Servidor](https://github.com/feira-de-jogos/nuvem/releases/tag/v2.0) e submódulos [REST API](https://github.com/feira-de-jogos/rest-api/releases/tag/v2.0) e [aplicação de usuário](https://github.com/feira-de-jogos/frontend/releases/tag/v2.0), onde os [serviços](serviços.md) são preparados com systemd e Docker.
- [Equipamentos terminais](https://github.com/feira-de-jogos/equipamentos/releases/tag/v2.0).

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

### Autenticação via OAuth 2.0

Entre as aplicações em rede:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Google
  end
  
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
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end

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
  J[Consulta operações recentes no BD]
  K
  L[Retorna 429]
  M[Insere operação de crédito no BD]
  N[Retorna 201]

  A --> B{JWT válido?}
  B -->|Sim| C{Requisição bem formatada?}
  B -->|Não| D
  C --> |Sim| E{Valor solicitado é inteiro natural?}
  C --> |Não| F
  E --> |Sim| G{Valor acima do limite?}
  E --> |Não| H
  G --> |Sim| I
  G --> |Não| J
  J --> K{Existe crédito recente?}
  K --> |Sim| L
  K --> |Não| M
  M --> N
```

### Operação de débito

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end
  
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
  E
  F[Retorna 400]
  G
  H[Retorna 403]
  I
  J[Retorna 403]
  K
  L[Retorna 402]
  M[Retorna 403]
  N
  P[Retorna 201]

  AA[Insere operação não concluída no banco]
  AB[Localiza a máquina do produto]
  AC[Notifica a máquina para inserir moeda]

  VA
  VB[Máquina ocupada]
  VC[Retorna 403]
  VD[Insere operação não concluída no banco]
  VE[Localiza slot do produto na máquina]
  VF[Localiza nome do comprador]
  VG[Notifica a máquina para estado MFA]

  A --> B{JWT válido?}
  B --> |Sim| C{Requisição bem formatada?}
  B --> |Não| D
  C --> |Sim| E{Máquina existe?}
  C --> |Não| F
  E --> |Sim| G{Produto existe?}
  E --> |Não| H
  G --> |Sim| I{Usuário tem saldo?}
  G --> |Não| J
  I --> |Sim| K{Máquina ocupada?}
  I --> |Não| L
  K --> |Sim| M
  K --> |Não| N{Tipo de máquina?}
  N --> |Vending machine| VA{Tem em estoque?}
  N --> |Arcade| AA

  AA --> AB
  AB --> AC
  AC --> P

  VA --> |Sim| VB
  VA --> |Não| VC
  VB --> VD
  VD --> VE
  VE --> VF
  VF --> VG
  VG --> P
```

### Operação de transferência

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end

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
  E[Consulta saldo do usuário no BD]
  F
  G[Consulta operações recentes no BD]
  H[Retorna 403]
  I
  J[Retorna 429]
  K[Insere operação de   transferência no BD]
  L[Retorna 201]
  M[Retorna 400]
  N[Retorna 402]
  O[Retorna 429]

  A --> B{JWT válido?}
  B -->|Sim| C{Requisição bem formatada?}
  B -->|Não| D
  C --> |Sim| E
  C --> |Não| M
  E --> F{Usuário tem saldo suficiente?}
  F --> |Sim| I{Valor de transferência válido?}
  F --> |Não| N
  I --> |Sim| G
  I --> |Não| H
  G --> J{Existe   transferência recente?}
  J --> |Sim| O
  J --> |Não| K
  K --> L
```

### Interação com Máquina de Vendas

A máquina de vendas opera com máquina de estados:

```mermaid
stateDiagram-v2
  [*] --> idle
  idle --> mfa
  mfa --> idle
  mfa --> releasing
  releasing -->  idle
  idle --> [*]
```

## APIs e estrutura do banco de dados relacional

A REST API está definida em formato [OpenAPI 3.0](https://swagger.io/specification/v3/) no arquivo [rest-api.json](rest-api.json). As operações entre máquinas e banco central são via WebSocket, estendendo a REST API em [machine.json](machine.json) (formato [AsyncAPI 3.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0)).

Já o banco está assim modelado (copiado do [original](https://drawsql.app/teams/feira-de-jogos/diagrams/feira-de-jogos-v2)):

![Modelagem do banco de dados, versão 2.](feira-de-jogos.png)

Para PostgreSQL, os comandos DDL e DML estão no arquivo [ddl.sql](ddl.sql) e [dml.sql](dml.sql), respectivamente.

### Exemplo de cenário: melhor caso em que usuário compra produto na máquina de vendas

Um exemplo de uso é o melhor cenário de compra de produto na máquina de vendas, onde o usuário faz a operação de débito e confirma com autenticação de dois fatores e, assim, a compra é concluída:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end
  participant Vending Machine

  Vending Machine ->>+ Servidor Web: GET /machine
  Servidor Web -->> Vending Machine: 101 Switching Protocols
  Vending Machine ->> Servidor Web: "stateUpdate": { "state": "idle", "operation": 0 }

  Usuário ->>+ Servidor Web: POST /login
  Servidor Web ->>- Usuário: 200 OK
  
  Usuário ->>+ Servidor Web: POST /debit
  Servidor Web ->>- Usuário: 200 OK

  Servidor Web  ->>+ Vending Machine: "stateMFA": { "username": "John", "code": 86, "operation": 1000 }
  Vending Machine ->>- Servidor Web: "stateUpdate": { "state": "mfa", "operation": 1000 }

  Usuário ->>+ Servidor Web: POST /mfa
  Servidor Web ->>- Usuário: 200 OK

  Servidor Web ->>+ Vending Machine: "stateReleasing": { "product": 1, "operation": 1000 }
  Vending Machine ->> Servidor Web: "stateUpdate": { "state": "releasing", "operation": 1000 }
  Servidor Web -->> Usuário: Release product
  Vending Machine ->>- Servidor Web: "stateUpdate": { "state": "idle", "operation": 1000 }

  Servidor Web ->>+ Banco de Dados: SQL DML: atualizar estoque e operação concluída
  Banco de Dados ->>- Servidor Web: SQL DML: banco atualizado

  Servidor Web ->>- Vending Machine: 200 OK
```

### Exemplo de cenário: melhor caso em que usuário insere moeda no fliperama (*arcade*)

Um exemplo de uso é o melhor cenário de inserção de moeda no fliperama, onde o usuário faz a operação de débito e a máquina de fliperama atualiza o saldo:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Servidor Web
    participant Banco de Dados
  end
  participant Arcade
  
  Arcade ->>+ Servidor Web: GET /machine
  Servidor Web -->> Arcade: 101 Switching Protocols
  
  Usuário ->>+ Servidor Web: POST /login
  Servidor Web ->>- Usuário: 200 OK
  
  Usuário ->>+ Servidor Web: POST /debit
  Servidor Web ->>- Usuário: 200 OK

  Servidor Web  ->>+ Arcade: "coinInsert": { "arcade": "1", "coins": 1, "operation": 1000 }
  Arcade ->>- Servidor Web: "coinInserted": { "arcade": "1", "operation": 1000 }
  Servidor Web -->> Usuário: Adição de moedas no fliperama

  Servidor Web ->>+ Banco de Dados: SQL DML: operação concluída
  Banco de Dados ->>- Servidor Web: SQL DML: banco atualizado

  Servidor Web ->>- Arcade: 200 OK
```
