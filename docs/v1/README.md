# Versão 1

Implementação simples, com autenticação embutida no corpo da requisição ([*basic*](https://datatracker.ietf.org/doc/html/rfc7617)).

O código está distribuído em vários repositórios:

- Servidor: [REST API](https://github.com/feira-de-jogos/rest-api/releases/tag/v1.0), [MQTT API](https://github.com/feira-de-jogos/mqtt-api/releases/tag/v1.0) e [aplicação de usuário](https://github.com/feira-de-jogos/frontend/releases/tag/v1.0).
- [Equipamentos terminais](https://github.com/feira-de-jogos/equipamentos/releases/tag/v1.0).

## Interação do Usuário com o Sistema

### 1. **Jogando Jogos e Recebendo Tijolinhos:**
   - O usuário inicia sua jornada jogando os jogos disponíveis.
   - Após cada jogo, insere seu ID e senha obtidos do banco na interface do jogo.
   - **Frontend do Jogo -> API (POST /credito) -> Banco de Dados (Atualização de Saldo) -> Frontend do Jogo**
   - O usuário recebe tijolinhos como recompensa pela participação.

### 2. **Consultando Extrato Financeiro:**
   - O usuário pode consultar seu extrato financeiro para visualizar ganhos e transações.
   - **Frontend do Usuário -> API (GET /extrato) -> Banco de Dados (Consulta de Extrato) -> Frontend do Usuário**

### 3. **Realizando PIX entre Jogadores:**
   - O usuário decide fazer um PIX para outro jogador.
   - **Frontend do Usuário -> API (GET /pix) -> Banco de Dados (Verificação e Atualização de Saldo) -> Frontend do Usuário**
   - O PIX é concluído, e os saldos são atualizados.

### 4. **Comprando Produtos no Dispenser:**
   - O usuário escolhe um produto no dispenser de alimentos.
   - Insere seu ID e senha na máquina para autenticação.
   - **Máquina -> API (POST /debito) -> Banco de Dados (Verificação e Atualização de Saldo) -> Máquina**
   - Se tiver saldo suficiente, o dispenser ejeta o alimento e o saldo é debitado.

### 5. **Atualizando Informações da Conta:**
   - O usuário pode atualizar informações da sua conta.
   - **Frontend do Usuário -> API (POST /conta) -> Banco de Dados (Atualização de Informações) -> Frontend do Usuário**
   - Por exemplo, alterar a senha.

### 6. **Administração do Sistema:**
   - Administradores podem acessar informações e funcionalidades específicas.
   - **Frontend do Administrador -> API (GET /adm) -> Banco de Dados (Consulta de Informações) -> Frontend do Administrador**
   - Atualizar estoque de produtos, informações da conta do jogador, etc.

### 7. **Atualizando Estoque de Produtos:**
   - Administradores podem atualizar o estoque de produtos.
   - **Frontend do Administrador -> API (POST /atualizar-estoque) -> Banco de Dados (Atualização de Estoque) -> Frontend do Administrador**

### 8. **Atualizando Valor de Produtos:**
   - Administradores podem atualizar o valor de produtos.
   - **Frontend do Administrador -> API (POST /atualizar-valor) -> Banco de Dados (Atualização de Valor) -> Frontend do Administrador**

### 9. **Integração com MQTT para Dispenser de Alimentos:**
   - A comunicação entre a API e o dispenser de alimentos ocorre via MQTT.
   - **API (MQTT Publish) -> Broker MQTT -> Dispenser (MQTT Subscribe)**

### 1. Cadastro e Autenticação
- O usuário cria uma conta no banco digital para feira de jogos `https://feira-de-jogos.sj.ifsc.edu.br` (já desativado).
- Ao iniciar a jornada, autentica-se nos jogos usando o sistema de autenticação via Google OAuth 2.0.

### 2. Interagindo com Jogos
- O usuário joga os jogos desenvolvidos pela 8ª fase de telecomunicações.
- Ao finalizar cada jogo, insere seu ID e senha obtidos do banco para receber tijolinhos.

### 3. Recompensas e Economia
- O usuário ganha tijolinhos como recompensa pela participação nos jogos.
- Pode consultar seu extrato financeiro para acompanhar ganhos e transações.

### 4. Gastos e Transações
- Utiliza os tijolinhos para diversas atividades econômicas, como fazer PIX entre jogadores.
- Realiza transações PIX para responsáveis de máquinas de jogos retro, possibilitando a continuação da jornada.

### 5. Dispenser de Alimentos
- Acesso ao dispenser de alimentos inserindo ID e senha.
- Se tiver saldo suficiente, o dispenser ejeta o alimento desejado usando uma mola.
- O saldo é debitado automaticamente do usuário.

### 6. Consultas e Atualizações da Conta
- O usuário pode consultar e atualizar informações da sua conta usando operações como `/extrato`, `/pix`, `/credito`, `/debito`, `/conta`.

### 7. Integração com MQTT
- A comunicação entre a aplicação e o dispenser de alimentos ocorre via MQTT, garantindo sincronização e comunicação bidirecional.

### 8. Serviços em Nuvem
- Utilização de um banco de dados relacional PostgreSQL para armazenar informações sobre jogadores, jogos, transações, produtos, entre outros.
- Serviços em nuvem, como MQTT para comunicação com dispositivos físicos e NGINX para gerenciar o tráfego da API.

### 9. Segurança
- Autenticação segura via OAuth 2.0 para acesso à API.
- Utilização de certificados SSL/TLS para proteger a comunicação entre o cliente e o servidor.

### 10. Ambiente do Servidor
- Configuração de variáveis de ambiente para diferentes serviços.
- Uso do Systemd para gerenciar os serviços da API e MQTT.

### 11. Diagrama de Blocos
- Visualização da arquitetura de serviços e protocolos por meio de um diagrama de blocos:

![diagrama de blocos](mermaid-diagram.png)

### 12. Atualizações do Sistema
- Possibilidade de atualização para a API (v2) pós-2023, conforme previsto.
- Atualizações do banco de dados relacional conforme necessário para manter a integridade e escalabilidade do sistema.


## REST API

#### Operações de jogador:

**Autenticação do jogador:**
- **Método:** POST
- **Path:** `/autenticacao`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Operação iniciada pela tela inicial do aplicativo do usuário, com autenticação via Google OAuth 2.0.
- **Entrada:** Requisição HTTP POST com o seguinte corpo:
  - `credential`: Token de identificação fornecido pelo Google Sign-In.
- **Respostas:**
  - **302: Found** - Redireciona para `/api/v1/extrato` em caso de sucesso na autenticação.
  - **500: Internal Server Error** - Erro interno no servidor.

**Extrato de jogador:**
- **Método:** GET
- **Path:** `/extrato`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:**
  - Operação que retorna a página HTML do extrato financeiro do jogador. A requisição deve ser feita via GET e ser autenticada usando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com o extrato do jogador.
  - **401: Unauthorized** - Redireciona para a tela de autenticação em caso de falha na autenticação.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Pix entre jogadores:**
- **Método:** GET
- **Path:** `/pix`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:**
  - Operação que retorna a página HTML para realizar uma transação Pix entre jogadores. A requisição deve ser feita via GET e ser autenticada usando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com o formulário para realizar uma transação Pix.
  - **302: Redirecionamento** - Em caso de autenticação bem-sucedida.
  - **401: Unauthorized** - Redireciona para a tela de autenticação em caso de falha na autenticação.
  - **404: Usuário não encontrado** - Retorna um JSON com `{ result: 1, message: 'Usuário não encontrado' }`.
  - **403: Saldo Insuficiente** - Retorna um JSON com `{ result: 2, message: 'Saldo Insuficiente' }`.
  - **400: Não é possível enviar um Pix para você mesmo!** - Retorna um JSON com `{ result: 3, message: 'Não é possível enviar um Pix para você mesmo!' }`.
  - **400: Valor abaixo de 1 tijolinho** - Retorna um JSON com `{ result: 4, message: 'Você não pode enviar um valor abaixo de 1 tijolinho' }`.
  - **200: Pix enviado com sucesso!** - Retorna um JSON com `{ result: 5, message: 'Pix enviado com sucesso!' }`.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Crédito para jogador:**
- **Método:** POST
- **Path:** `/credito`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Realiza uma operação de crédito para um jogador específico.
- **Parâmetros:**
  - `id` (Identificador do jogador)
  - `senha` (Senha do jogador)
  - `jogo` (Identificador do jogo)
  - `valor` (Valor da operação em tijolinhos)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Débito para jogador:**
- **Método:** POST
- **Path:** `/debito`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** O corpo da requisição deve ser em JSON.
- **Parâmetros:**
  - `id` (Identificador do jogador)
  - `senha` (Senha do jogador)
  - `maquina` (Identificador da máquina)
  - `produto` (Identificador do produto)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **402: Pagamento não autorizado** - Saldo Insuficiente
  - **403: Forbidden** - Produto inexistente ou sem estoque.
  - **500: Erro Interno do Servidor** -  Erro interno no servidor.

**Conta do jogador:**
- **Método:** POST
- **Path:** `/conta`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza informações da conta do jogador, permitindo visualizar e modificar dados como nome, ID, senha e saldo. A requisição deve ser autenticada utilizando o token fornecido durante a autenticação via Google OAuth 2.0. O corpo da requisição deve ser em JSON.
- **Parâmetros:**
  - `idNumero` (Identificador do jogador)
  - `novaSenha` (Nova senha para atualização)
- **Respostas:**
  - **200: OK** - Retorna JSON com resultado da operação.
  - **400: Bad Request** - Formato da requisição inválido ou senhas não coincidem.
  - **401: Unauthorized** - Autenticação inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização da senha.


### Operações de administrador:

#### Atualizar Informações da Conta do Jogador:

- **Método:** GET
- **Path:** `/adm`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Recupera informações de um jogador com perfil de administrador. A requisição deve ser autenticada utilizando o token fornecido durante a autenticação via Google OAuth 2.0.
- **Respostas:**
  - **200: OK** - Retorna uma página HTML com informações e funcionalidades para administradores.
  - **302: Found** - Redireciona para a página de login se o usuário não estiver autenticado.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante o processamento.

#### Atualizar Estoque do Produto

- **Método:** POST
- **Path:** `/atualizar-estoque`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza o estoque de um produto. Requer autenticação de administrador e fornece informações como o ID do produto e a quantidade a ser atualizada.
- **Parâmetros:**
  - `productIdE` (ID do produto)
  - `amountE` (Quantidade a ser atualizada no estoque)
  - `idNumero` (Identificador do administrador)
- **Respostas:**
  - **200: OK** - Estoque atualizado com sucesso.
  - **400: Bad Request** - Produto não encontrado, tentativa de alterar o estoque do Pix ou quantidade negativa.
  - **401: Unauthorized** - Autenticação de administrador inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização do estoque.

#### Atualizar Valor do Produto

- **Método:** POST
- **Path:** `/atualizar-valor`
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Atualiza o valor de um produto. Requer autenticação de administrador e fornece informações como o ID do produto e a quantidade a ser atualizada.
- **Parâmetros:**
  - `productIdV` (ID do produto)
  - `amountV` (Novo valor do produto)
  - `idNumero` (Identificador do administrador)
- **Respostas:**
  - **200: OK** - Valor do produto atualizado com sucesso.
  - **400: Bad Request** - Produto não encontrado, tentativa de alterar o valor do Pix ou valor negativo.
  - **401: Unauthorized** - Autenticação de administrador inválida.
  - **500: Erro Interno do Servidor** - Erro interno no servidor durante a atualização do valor do produto.

### Operação de máquina:

#### Estoque de máquina:
- **Método:** POST
- **Path:** /estoque
- **Base URL:** https://feira-de-jogos.sj.ifsc.edu.br/api/v1
- **Resumo:** Operação para verificar o estoque da máquina.
- **Parâmetros:**
  - `id` (Identificador da máquina)
  - `senha` (Senha atribuída a máquina)
  - `produto` (Identificador do produto)
  - `quantidade` (Quantidade atualizada do produto)
- **Respostas:**
  - **200: OK** - Retorna JSON com o estoque corrente da máquina.
  - **400: Bad Request** - Formato da requisição inválida.
  - **401: Unauthorized** - Autenticação inválida.
  - **403: Forbidden** - Operação inválida: produto não existe ou não pode ser estocado nessa máquina.

## Banco de dados relacional

O banco foi assim modelado (copiado do [original](https://drawsql.app/teams/feira-de-jogos/diagrams/feira-de-jogos-v1)):

![Modelagem do banco de dados, versão 1.](feira-de-jogos.png)

Para PostgreSQL, os comandos DDL estão no arquivo [ddl.sql](ddl.sql).
