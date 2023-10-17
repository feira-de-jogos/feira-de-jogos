---
description: Descrição dos serviços do sistema econômico.
---

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
