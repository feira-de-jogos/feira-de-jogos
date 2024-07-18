export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar', './assets/iniciar.mp3')
    this.load.audio('mapa', './assets/mapa.mp3')

    this.load.image('espaço', './assets/espaço.png')
  }

  create () {
    // Define o objeto de som
    this.iniciar = this.sound.add('iniciar')
    this.iniciar.play()

    // Adiciona a imagem de fundo
    this.add.image(400, 225, 'espaço')

    // Adiciona o texto da sala
    this.mensagem = this.add.text(100, 130, 'Escolha a sala:', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })

    // Adiciona as salas
    this.salas = [
      { x: 200, y: 230, numero: '1' },
      { x: 300, y: 230, numero: '2' },
      { x: 400, y: 230, numero: '3' },
      { x: 500, y: 230, numero: '4' },
      { x: 600, y: 230, numero: '5' },
      { x: 200, y: 350, numero: '6' },
      { x: 300, y: 350, numero: '7' },
      { x: 400, y: 350, numero: '8' },
      { x: 500, y: 350, numero: '9' },
      { x: 600, y: 350, numero: '10' }
    ]

    // Para cada sala, adiciona o botão de seleção
    this.salas.forEach(sala => {
      sala.texto = this.add.text(sala.x, sala.y, sala.numero, {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Courier New'
      })
        .setInteractive()
        .on('pointerdown', () => {
          // Remove os textos das salas
          this.salas.forEach(sala => {
            sala.texto.destroy()
          })

          // Define a variável global da sala
          globalThis.game.sala = sala.numero

          // Emite o evento 'entrar-na-sala' para o servidor
          globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)
        })
    })

    // Define o evento de recebimento da mansagem 'jogadores'
    globalThis.game.socket.on('jogadores', (jogadores) => {
      // Se o segundo jogador já estiver conectado, inicia o jogo
      if (jogadores.segundo) {
        // Apresenta texto na tela
        this.mensagem.setText('Conectando...')

        // Define a variável global dos jogadores
        globalThis.game.jogadores = jogadores

        // Para a cena atual e inicia a cena do mapa
        globalThis.game.scene.stop('sala')
        globalThis.game.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }

  update () {
  }
}
