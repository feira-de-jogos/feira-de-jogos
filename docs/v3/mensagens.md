| Comando | Ação | Parâmetros | Emissor | Receptor | Resposta |
|-|-|-|-|-|-|
| `/transfer` | `create` | `<jogador> <valor>` | jogador | banco | `<id>`
| `/transfer` | `read` | `<id>` | jogador, bancário | banco |
| `/transfer` | `update` | `<id> <valor>` | bancário | banco |
| `/transfer` | `delete` | `<id>` | bancário | banco |
| `/credit` | `create` | `<jogador> <produto>` | bancário, servidor | banco | `<id>`
| `/credit` | `read` | `<id>` | jogador, bancário, servidor | banco |
| `/credit` | `update` | `<id> <produto>` | bancário, servidor | banco |
| `/credit` | `delete` | `<id>` | bancário, servidor | banco |
| `/debit` | `create` | `<jogador> <produto>` | jogador, bancário | banco | `<id>`
| `/debit` | `read` | `<id>` | jogador, bancário, servidor | banco |
| `/debit` | `update` | `<id> <produto>` | bancário, servidor | banco |
| `/debit` | `delete` | `<id>` | bancário, servidor | banco |
| `/sprite` | `create` | `<b64>` | jogador | personagem | `<id>`
| `/sprite` | `read` | `<id>` | jogador, operador, feira, servidor | personagem |
| `/sprite` | `update` | `<id> <produto>` | jogador, operador | personagem |
| `/sprite` | `delete` | `<id>` | jogador, operador | personagem |
| `/game` | `msg` | `<jogo> <data>` | jogador | feira, servidor |
| `/game` | `sprite` | `<id>` | jogador | feira, servidor |
