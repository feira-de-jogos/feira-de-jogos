# Preparação do ambiente dos serviços em nuvem

Na primeira versão do ambiente, os serviços eram gerenciados pelo `systemd`.

Na segunda versão, a mais atual, é usado o Docker Compose. Os serviços são configurados e iniciados no repositório [`nuvem`](https://github.com/feira-de-jogos/nuvem). 

Para rodar o ambiente, é preciso criar os seguintes arquivos e conteúdos no diretório raiz daquele repositório:

- `env-db-postgres-password`: a senha mestre do banco de dados relacional PostgreSQL.
- `env-rest-api-google-client-id`: ID de credencial criado no GCP.
