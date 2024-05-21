# Sobre a Feira de Jogos

As boas ideias não surgem em escritórios fechados, em horário comercial, sob a luz quase asséptica de lâmpadas fluorescentes.

![Matrix](imagens/matrix.jpeg)

Foi em um final de tarde, no bar, tomando café, que dois professores resolveram juntar *hardware* e *software* da melhor forma: com jogos, claro.

Assim, surgiu a Feira de Jogos, um projeto de ensino e pesquisa para apresentar ao mundo os jogos desenvolvidos no último semestre do Ensino Integrado ao Médio em Telecomunicações do Instituo Federal de Santa Catarina campus São José.

Nos anos anteriores, já havia os jogos, mas faltava  atrair o público. Uma inovação em relação aos anos anteriores foi que cada jogo, uma vez terminado, rende dinheiro virtual, os **Tijolinhos** (**$TJL**), para serem gastos na Feira: troca de brindes e doces, jogos antigos na *lanhouse* etc.

Foi preciso, assim, pensar na [economia](economia.md) da Feira, bem como nos [serviços](serviços.md) e padrões para manter todo o evento. Segue o mapa mental da ideia geral:

![Diagrama do funcionamento da feira](infografico.jpg)

Como o projeto depende de financiamento, devido a bolsas de pesquisa e custos de produção e operação (compra dos brindes, material para as máquinas e outros), foi projetado um modelo simples para o segundo semestre de 2023, denominado [**versão 1**](v1.md). Várias melhorias foram feitas para o semestre seguinte, no início de 2024 - a [**versão 2**](v2.md).


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
- **Cadastro:** cadastro e manutenção de conta de usuário;
- **Banco:** operador financeiro, o banco do sistema econômico.

![Diagrama de blocos dos serviços e seus protocolos](imagens/mermaid-diagram.png)
