# Estações Meteorológicas

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

- [#45](https://github.com/feira-de-jogos/feira-de-jogos/issues/45): o formato das mensagens das estações para o *broker* é baseado no [*line protocol* do InfluxDB, versão 2](https://docs.influxdata.com/influxdb/v2/reference/syntax/line-protocol/):

- Tópico: `em/<uuid>`, onde `<uuid>` é o identificador da estação;
- Mensagem: `em/<uuid>,v=<versão>,lat=<lat>,lng=<longitude>,alt=<altitude> <chave1>=<valor1>,<chave1>=<valor1>,...,<chaveN>=<valorN> <ns_timestamp>`, onde:
  - `<uuid>`: identificador da estação;
  - `<versão>`: versão da estação em inteiros (0, 1 etc.);
  - `<lat>`: latitude da estação;
  - `<lng>`: longitude da estação;
  - `<alt>`: altitude da estação;
  - `<chave>`: nome do atributo a ser armazenado;
  - `<valor>`: valor do atributo a ser armazenado;
  - `<ns_timestamp>`: UNIX timestamp em nanossegundos.
  
  Exemplo:
  
  ```text
  Tópico: em/8364DE0C-2534-431A-B6A2-965569C3EE52
  Mensagem: 8364DE0C-2534-431A-B6A2-965569C3EE52,v=1,lat=-27.608574,lng=-48.633181,alt=57 temperatura=17,umidade=76.4 1751665693000000000
  ```

Para visualizar os dados: [painel do Grafana](https://grafana.feira-de-jogos.dev.br/public-dashboards/7957a49460e34d0f8a41f393526cf09b).
