# Feira de Jogos

Escolhas:

- [#1](https://github.com/feira-de-jogos/feira-de-jogos/issues/1) e [#3](https://github.com/feira-de-jogos/feira-de-jogos/issues/3): [Phaser 4 (rc4)](https://phaser.io/news/2025/05/phaser-mega-update)  com [TypeScript](https://www.typescriptlang.org/).
- [#2](https://github.com/feira-de-jogos/feira-de-jogos/issues/2): [Parcel](https://parceljs.org/).
- [#5](https://github.com/feira-de-jogos/feira-de-jogos/issues/5): [Docker Compose](https://docs.docker.com/compose/) com [réplicas](https://docs.docker.com/reference/compose-file/deploy/#replicas) e [monitoramento de contêiner](https://docs.docker.com/reference/compose-file/services/#healthcheck).
- [#8](https://github.com/feira-de-jogos/feira-de-jogos/issues/8): [Node.js](https://nodejs.org/).
- [#10](https://github.com/feira-de-jogos/feira-de-jogos/issues/10): cluster [Node.js](https://nodejs.org/) e [Redis Streams](https://redis.io/) via [Redis Streams](https://socket.io/docs/v4/redis-streams-adapter/).
- [#11](https://github.com/feira-de-jogos/feira-de-jogos/issues/11): Sinalização de mídia com [Livekit](https://livekit.io/) e lógica de jogo com [Socket.IO](https://socket.io/).
- [#12](https://github.com/feira-de-jogos/feira-de-jogos/issues/12): SFU com [Livekit](https://livekit.io/).

```mermaid
flowchart LR
  A[Jogador]
  B[Proxy HTTP]
  C1[Node.js + Socket.IO]
  C2[Node.js + Socket.IO]
  C3[Node.js + Socket.IO]
  D[Redis Streams]

  A --> B
  B --> C1
  B --> C2
  B --> C3
  C1 --> D
  C2 --> D
  C3 --> D
```

Para as estações meteorológicas, o fluxo é  o seguinte:

```mermaid
sequenceDiagram
  box Local
    actor Usuário
    participant Web App
    participant Estação
  end
  
  box Nuvem
    participant Broker
    participant Assinante
    participant TSDB
    participant Grafana
    participant REST API
  end

  Note over Usuário,TSDB: Fluxo de gravação dos dados

  Assinante ->> Broker: [SUBSCRIBE] sensores

  loop 1x/min
    Estação ->> Broker: [PUBLISH] sensores
    activate Broker
    Broker ->> Assinante: [NOTIFY] sensores
    deactivate Broker
    activate Assinante
    Assinante ->> TSDB: [Gravar] sensores
    deactivate Assinante
  end

  Note over Usuário,Grafana: fluxo de leitura dos dados no Grafana

  Usuário ->> Grafana: [Consultar] gráfico
  activate Grafana
  Grafana ->> TSDB: [Consultar] sensores
  Activate TSDB
  TSDB ->> Grafana: [Responder] sensores
  deactivate TSDB
  Grafana ->> Usuário: [Responder] gráfico
  deactivate Grafana

  Note over Usuário,REST API: fluxo de leitura dos dados na aplicação Web

  Usuário ->> Web App: [Consultar] dados
  activate Web App
  Web App ->> REST API: [Consultar] dados
  activate REST API
  REST API ->> TSDB: [Consultar] sensores
  Activate TSDB
  TSDB ->> REST API: [Responder] sensores
  deactivate TSDB
  REST API ->> Web App: [Responder] dados
  deactivate REST API
  Web App ->> Usuário: [Responder] dados
  deactivate Web App
```