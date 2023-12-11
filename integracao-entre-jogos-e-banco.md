# Integração entre jogos e banco

Os requisitos são os seguintes:

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

O acesso é padronizado para microprocessados (aplicações Web) e microcontrolados, baseado em REST API + JSON, uma vez que o sentido das mensagens é, basicamente, do cliente para o servidor. As aplicações a serem desenvolvidas ao longo do projeto são:

* Cadastro: cadastro e manutenção de conta de usuário;
* Banco: operador financeiro, o banco do sistema econômico.



<figure><img src=".gitbook/assets/mermaid-diagram-2023-11-06-234505 (1).png" alt="Diagrama de blocos dos serviços e seus protocolos"><figcaption><p>Diagrama de blocos dos serviços e seus protocolos</p></figcaption></figure>

## REST API

Duas versões previstas:

1. Versão 1.0 (`v1`), de 2023;
2. Versão 2.0 (`v2`), pós 2023.

### API v1

Implementação simples, com autenticação embutida no corpo da requisição.

#### Operações de jogador:

{% swagger method="post" path="/extrato" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Extrato de jogador" %}
{% swagger-description %}
Operação iniciada pela tela inicial do aplicativo do usuário, com autenticação via Google OAuth 2.0.
{% endswagger-description %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com lista de débitos e créditos.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/credito" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Crédito para jogador" %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" name="id" %}
Identificador do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="jogo" type="" required="true" %}
Identificador do jogo.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" required="true" %}
Valor da operação em tijolinhos.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com resultado da operação.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação não é possível por falta de recursos no banco.
{% endswagger-response %}
{% endswagger %}

{% swagger method="post" path="/debito" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Débito para jogador" %}
{% swagger-description %}
O corpo da requisição deve ser em JSON.
{% endswagger-description %}

{% swagger-parameter in="body" required="true" name="id" %}
Identificador do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha do jogador.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="maquina" required="true" %}
Identificador da máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="produto" required="true" %}
Identificador do produto.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="valor" required="true" %}
Valor do produto em tijolinhos.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com resultado da operação.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação de crédito não é possível por falta de recursos do jogador.
{% endswagger-response %}
{% endswagger %}

#### Operação de máquina:

{% swagger method="post" path="/estoque" baseUrl="https://feira-de-jogos.sj.ifsc.edu.br/api/v1" summary="Estoque de máquina" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="id" required="true" %}
Identificador da máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="senha" required="true" %}
Senha atribuída a máquina.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="produto" required="false" %}
Identificador do produto.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="quantidade" required="false" %}
Quantidade atualizada do produto.
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
Retorna JSON com o estoque corrente da máquina.
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
Formato da requisição inválida.
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
Autenticação inválida.
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="" %}
Operação inválida: produto não existe ou não pode ser estocado nessa máquina.
{% endswagger-response %}
{% endswagger %}
