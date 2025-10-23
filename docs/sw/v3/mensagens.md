| Comando     | Ação     | Parâmetros                                                             | Emissor                             | Receptor   | Resposta |
| ----------- | -------- | ---------------------------------------------------------------------- | ----------------------------------- | ---------- | -------- |
| `/credit`   | `create` | `jogador` `produto`                                                    | servidor do jogo, bancário          | banco      | `id`     |
|             | `read`   | `id`                                                                   | jogador, servidor do jogo, bancário | banco      |
|             | `update` | `id` `produto`                                                         | bancário                            | banco      |
|             | `delete` | `id`                                                                   | bancário                            | banco      |
| `/debit`    | `create` | `jogador` `produto`                                                    | jogador, bancário                   | banco      | `id`     |
|             | `read`   | `id`                                                                   | jogador, servidor do jogo, bancário | banco      |
|             | `update` | `id` `produto`                                                         | bancário                            | banco      |
|             | `delete` | `id`                                                                   | bancário                            | banco      |
| `/transfer` | `create` | `destino` `valor`                                                      | jogador                             | banco      | `id`     |
|             | `read`   | `id`                                                                   | jogador, bancário                   | banco      |
|             | `update` | `id` `valor`                                                           | bancário                            | banco      |
|             | `delete` | `id`                                                                   | bancário                            | banco      |
| `/sprite`   | `create` | `b64`                                                                  | jogador                             | personagem | `id`     |
|             | `read`   | `id`                                                                   | jogador, operador, feira, servidor  | personagem |
|             | `update` | `id` `produto`                                                         | jogador, operador                   | personagem |
|             | `delete` | `id`                                                                   | jogador, operador                   | personagem |
| `/state`    | `create` |                                                                        | jogador                             | estado     | `id`     |
|             | `read`   | `id`                                                                   | jogador, operador                   | estado     |
|             | `update` | `id`                                                                   | jogador                             | estado     |
|             | `delete` | `id`                                                                   | jogador, operador                   | estado     |
| `/game`     | `create` | `nome` `descrição` `imagem` `valor`                                    | operador                            | feira      | `id`     |
|             | `read`   | `id`                                                                   | operador                            | feira      |
|             | `update` | `id` `nome` `descrição` `imagem` `valor`                               | operador                            | feira      |
|             | `delete` | `id`                                                                   | operador                            | feira      |
| `/checkout` | `create` | `nome` `descrição` `imagem` `valor`                                    | operador                            | feira      | `id`     |
|             | `read`   | `id`                                                                   | operador                            | feira      |
|             | `update` | `id nome localização slots`                                            | operador                            | feira      |
|             | `delete` | `id`                                                                   | operador                            | feira      |
| `/product`  | `create` | `nome` `descrição` `imagem` `quantidade` `valor` `máquina` `slot`      | operador                            | feira      | `id`     |
|             | `read`   | `id`                                                                   | operador                            | feira      |
|             | `update` | `id` `nome` `descrição` `imagem` `quantidade` `valor` `máquina` `slot` | operador                            | feira      |
|             | `delete` | `id`                                                                   | operador                            | feira      |
| `/log`      | `create` | `jogador` `origem` `gravidade` `mensagem`                              | jogador, servidor do jogo, feira    | log        | `id`     |
|             | `read`   | `id`                                                                   | operador                            | log        |
|             | `update` | `id` `jogador` `origem` `gravidade` `mensagem`                         | operador                            | log        |
|             | `delete` | `id`                                                                   | operador                            | log        |

Observações:

- Os parâmetros, preferencialmente, devem estar entre aspas simples ou duplas. Em casos como `descrição`, onde é um texto longo, o uso de aspas é obrigatório.
- Um parâmetro pode ser omitido com hífen, `-`, para ignorá-lo. Isso é particularmente útil nas ações de `update` ou mesmo `create` (parâmetro opcional).
