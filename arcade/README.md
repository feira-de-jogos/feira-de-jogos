# Configuração

O *arcade* será controlado remotamente via teclado virtual. A tecla `SELECT`, que é usada nos emuladores MAME (e derivados) também como `COIN` (de adicionar moeda), deverá ser exclusiva do teclado. O mesmo deve ser feito com `HOTKEY`, para evitar saída do jogo ou outras funções especiais do RetroArch, como salvar e recuperar estado de jogo.

## Joystick

1. Deixar os botãos `SELECT` e `HOTKEY` sem função na autoconfiguração. Deve ficar o arquivo `/opt/retropie/configs/all/retroarch/autoconfig/usb\ gamepad.cfg` (ou equivalente) assim:

```ini
input_device = "usb gamepad           "
input_driver = "udev"
input_l_btn = "4"
input_l_btn_label = "L"
input_up_axis = "-1"
input_up_axis_label = "D-Pad Up"
input_left_axis = "-0"
input_left_axis_label = "D-Pad Left"
input_right_axis = "+0"
input_right_axis_label = "D-Pad Right"
input_r_btn = "6"
input_r_btn_label = "R"
input_y_btn = "3"
input_y_btn_label = "Y"
input_x_btn = "0"
input_x_btn_label = "X"
input_down_axis = "+1"
input_down_axis_label = "D-Pad Down"
input_start_btn = "9"
input_start_btn_label = "Start"
input_b_btn = "2"
input_b_btn_label = "B"
input_a_btn = "1"
input_a_btn_label = "A"
```

2. Configurar o arquivo `/opt/retropie/configs/all/retroarch.cfg` para desativar o botão `SELECT` via *joystick*:

```ini
input_enable_hotkey_btn = "nul"
```

## Teclado virtual

O teclado virtual é a aplicação que recebe comenados remotamente e adiciona moedas ao jogo.

1. Adicionar os módulos de *kernel* no final do arquivo `/etc/modules`:

```
uinput
evdev
```

2. Permitir que a aplicação seja executada pelo usuário `pi`, que por padrão já pertence ao grupo `games`. Criar, assim, o arquivo `/etc/udev/rules.d/10-uinput.rules` com o seguinte conteúdo:

```
KERNEL=="uinput", MODE="0660", GROUP="games"
```

O arquivo [`moeda.py`](moeda.py) é um exemplo de como criar um teclado virtual e enviar comandos diretamente para o jogo emulado: adicionar algumas moedas e depois fechar o próprio jogo.

## Teclado físico

O teclado físico não é obrigatório. Seu uso é apenas emergencial para adicionar manualmente moedas e fechar o jogo.

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

Dessa forma, será possível controlar o *arcade* remotamente, bem como permitir a manutenção local do equipamento em caso de necessidade.
