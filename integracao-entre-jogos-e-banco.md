---
description: API entre jogos e banco.
---

# Integração entre jogos e banco

Duas versões previstas:

1. Versão 1.0 (`v1`), de 2023;
2. Versão 2.0 (`v2`), pós 2023.

## API v1

{% swagger method="post" path="/extrato" baseUrl="https://feira-de-jogos.com/v1" summary="Consulta de extrato de débitos e créditos." %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com lista de débitos e créditos.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}

{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}

{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/credito" baseUrl="https://feira-de-jogos.com/v1" summary="Operação de crédito para o jogador." %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" type="" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}

{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}

{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}

{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação não é possível por falta de recursos no banco.
{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/debito" baseUrl="https://feira-de-jogos.com/v1" summary="Operação de débito para o jogador." %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}

{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}

{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}

{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação de crédito não é possível por falta de recursos do jogador.
{% endswagger-response %}
{% endswagger %}
