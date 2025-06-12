# Configuração

A tecla `SELECT`, que é usada nos emuladores MAME (e derivados) também como `COIN` (de adicionar moeda), deve ser exclusiva do teclado virtual - de operação remota. O mesmo deve ser feito com `HOTKEY`, para evitar saída do jogo ou outras funções especiais do RetroArch, como salvar e recuperar estado de jogo.

As teclas `J` e `K` são usadas para adicionar moedas (`HOTKEY`/`COIN`) e fechar o jogo (`EXIT` quando combinada com `HOTKEY`), respectivamente. O teclado físico é usado apenas em caso de emergência.

## Joystick

Para que o *joystick* funcione apenas com os comandos do jogo, deve-se:

1. Deixar os botãos `SELECT` e `HOTKEY` sem função na autoconfiguração, mais especificamente nos arquivos do diretório `/opt/retropie/configs/all/retroarch/autoconfig/`:

  - Sem qualquer menção ao botão físico `8` (`SELECT`);
  - O botão `9` deve ser mencionado apenas para iniciar o jogo: `input_start_btn`.

2. Configurar o arquivo `/opt/retropie/configs/all/retroarch.cfg` para desativar o botão `SELECT` via *joystick*:

```ini
input_enable_hotkey_btn = "nul"
```

## Teclado virtual

O teclado virtual é a aplicação que recebe comandos remotamente e adiciona moedas ao jogo:

1. Adicionar os módulos de *kernel* no final do arquivo `/etc/modules`:

```
uinput
evdev
```

2. Permitir que a aplicação seja executada pelo usuário `pi` (usuário padrão de Raspberry Pi e semelhantes), que por padrão já pertence ao grupo `games`. Criar, assim, o arquivo `/etc/udev/rules.d/10-uinput.rules` com o seguinte conteúdo:

```
KERNEL=="uinput", MODE="0660", GROUP="games"
```

O teclado virtual é implementado no arquivo [`client.py`](client.py), onde a função `coinInsert()` define a inserção de moeda por controle remoto, conforme a [documentação](https://github.com/feira-de-jogos/docs/blob/v2.0/v2/machine.json).

## Teclado físico

O teclado físico não é obrigatório. Seu uso é apenas emergencial para adicionar manualmente moedas e fechar o jogo:

1. Configurar o arquivo `/opt/retropie/configs/all/retroarch.cfg` para fixar o botão `SELECT` na tecla `j` e `START` na tecla `k`:

```ini
input_player1_select = "j"
input_player1_start = "k"
```

2. As teclas podem ser usadas também para sair do jogo, ao configurar o arquivo `/opt/retropie/configs/all/retroarch.cfg` para fixar o botão `HOTKEY` na tecla `j` e função de sair do jogo na tecla `k`:

```ini
input_enable_hotkey = "j"
input_exit_emulator = "k"
```
