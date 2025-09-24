# Versão 3

## Requisitos funcionais e não funcionais

Requisitos funcionais:

1. Suporte a IPv4 e IPv6.
1. Suporte a TCP e UDP para transferência de arquivos.
1. Suporte a UDP, SCTP e SCTP sobre UDP para mídias em tempo real.
1. Suporte a HTTP nas versão 1.0, 1.1, 2.0 e 3.0.
1. Suporte a WebSocket sobre HTTP/1.1.
1. Balanceamento de carga em serviços Web e WebSocket.
1. Autenticação e autorização com OAuth 2.0 no Google e posterior sessão via *cookie* para permitir autorização entre URLs distintas.
1. Suporte obrigatório às seguintes APIs Web: Device orientation, Fullscreen, Gamepad, Geolocation, Service worker, Storage, Touch, WebGL, WebRTC, WebSocket.
1. Suporte desejável às APIs Web: Battery, Web Bluetooth, Console, Fetch,  Notification, Performance, Push, Vibration, WebTransport, WebXR.
1. Persistência dos dados de usuários em bancos de dados centralizado.
1. Uso de *Selective Forwarding Unit* (SFU) para mídias em tempo real entre os jogadores.
1. Suporte a pelo menos 1000 conexões WebSocket simultâneas.
1. Suporte a pelo menos 20 fluxos de áudio em mesma sessão de mídia.

Requisitos não funcionais:

1. Testes regulares de carga em servidores e de monitoramento dos serviços Web.
1. Possibilidade de migração futura de WebSocket sobre HTTP/1.1 para WebTransport sobre HTTP/3.
1. Possibilidade de migração futura de SRTP sobre HTTP/1.1 e HTTP/2.0 para Media over QUIC (MoQ) sobre HTTP/3.

## Escolhas tecnológicas

- [#1](https://github.com/feira-de-jogos/feira-de-jogos/issues/1) e [#3](https://github.com/feira-de-jogos/feira-de-jogos/issues/3): [Phaser 4 (rc4)](https://phaser.io/news/2025/05/phaser-mega-update)  com [TypeScript](https://www.typescriptlang.org/).
- [#2](https://github.com/feira-de-jogos/feira-de-jogos/issues/2): [Parcel](https://parceljs.org/).
- [#5](https://github.com/feira-de-jogos/feira-de-jogos/issues/5): [Docker Compose](https://docs.docker.com/compose/) com [réplicas](https://docs.docker.com/reference/compose-file/deploy/#replicas) e [monitoramento de contêiner](https://docs.docker.com/reference/compose-file/services/#healthcheck).
- [#8](https://github.com/feira-de-jogos/feira-de-jogos/issues/8): [Node.js](https://nodejs.org/).
- ~~[#10](https://github.com/feira-de-jogos/feira-de-jogos/issues/10): *cluster* [Node.js](https://nodejs.org/) e [Redis Streams](https://redis.io/) via [Redis Streams](https://socket.io/docs/v4/redis-streams-adapter/).~~ (revisado em [#75](https://github.com/feira-de-jogos/feira-de-jogos/issues/75)).
- [#11](https://github.com/feira-de-jogos/feira-de-jogos/issues/11): Sinalização de mídia com [Livekit](https://livekit.io/) ~~e lógica de jogo com [Socket.IO](https://socket.io/)~~ (revisado em [#75](https://github.com/feira-de-jogos/feira-de-jogos/issues/75)).
- [#12](https://github.com/feira-de-jogos/feira-de-jogos/issues/12) e [#55](https://github.com/feira-de-jogos/feira-de-jogos/issues/55): (*Selective Forwarding Unit*) SFU com cluster [Livekit](https://livekit.io/) e Redis.
- [#13](https://github.com/feira-de-jogos/feira-de-jogos/issues/13): *Single Sign-On* (SSO) via OAuth 2.0  no Google e posterior sessão com o uso de *cookies*.
- [#22](https://github.com/feira-de-jogos/feira-de-jogos/issues/22): MongoDB para operações além de SQL, além de permitir [dados menos estruturados](./banco-de-dados.md).
- [#55](https://github.com/feira-de-jogos/feira-de-jogos/issues/55): *cluster* LiveKit com Redis.
- [#75](https://github.com/feira-de-jogos/feira-de-jogos/issues/75): servidor Matrix.org como *message broker* entre as aplicações.

## Integração entre serviços

De acordo com [#5](https://github.com/feira-de-jogos/feira-de-jogos/issues/5), [#6](https://github.com/feira-de-jogos/feira-de-jogos/issues/6) [#7](https://github.com/feira-de-jogos/feira-de-jogos/issues/7) e [#63](https://github.com/feira-de-jogos/feira-de-jogos/issues/63), os serviços estão assim interligados:

```mermaid
flowchart LR
    subgraph Local
        jogo[Jogo]

        subgraph clusterRPi[Cluster de borda]
            subgraph rpi1[Raspberry Pi 5]
                livekitEngine1[LiveKit Engine]
            end
            subgraph rpi2[Raspberry Pi 5]
                livekitEngine2[LiveKit Engine]
            end
        end
    
        em[Estação Meteorológica]
    end
    
    subgraph nuvem[Nuvem]
        subgraph feira[Feira de Jogos]
            proxy[Proxy HTTP]

            subgraph matrix[Comunicação Instantânea]
                homeserver[Matrix.org Homeserver]
                
                banco[Banco]
                personagem[Criador de Personagem]

                subgraph matrixBDs[Bancos de Dados]
                    postgresql[SQL]
                    mongo[noSQL]
                end
            end

            subgraph sfu[SFU]
                livekitGateway[LiveKit Gateway]
                redis[Redis]
            end

            subgraph dadosMeteorologicos[Dados Meteorológicos]
                mqtt[MQTT Broker]
                tsdb[TSDB]
                grafana[Grafana]
                assinante[Assinante]
            end
        end

        subgraph servidorJogo[Servidor de jogo]
            servidor[Servidor]
        end
    end
    
    jogo --> proxy
    
    jogo --> clusterRPi

    proxy --> homeserver
    homeserver --> postgresql

    banco --> homeserver
    banco --> mongo

    personagem --> homeserver
    personagem --> mongo

    proxy --> livekitGateway
    homeserver --> livekitGateway
    livekitEngine1 --> redis
    livekitEngine2 --> redis
    livekitGateway --> redis

    em --> mqtt
    em --> proxy
    proxy --> mqtt
    assinante --> mqtt
    assinante --> tsdb
    proxy --> grafana
    grafana --> tsdb
    proxy --> tsdb

    servidor --> proxy
```


## Desenvolvimento dos jogos

Para os jogos a serem desenvolvidos nesta versão, há um [fluxo de tarefas](./projeto.md) recomendado, bem como um [exemplo de ideia inicial](./sobre-o-jogo.md).
