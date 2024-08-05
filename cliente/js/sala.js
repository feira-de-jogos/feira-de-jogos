export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar', './assets/iniciar.mp3')

    this.load.image('espaço', './assets/espaço.png')

    this.load.image('nada', './assets/nada.png')
  }

  create () {
    // Define o objeto de som
    this.iniciar = this.sound.add('iniciar')

    // Adiciona a imagem de fundo
    this.add.image(400, 225, 'espaço')

    // Adiciona as salas
    this.salas = [
      { x: 210, y: 270, numero: '1' },
      { x: 300, y: 270, numero: '2' },
      { x: 390, y: 270, numero: '3' },
      { x: 470, y: 270, numero: '4' },
      { x: 550, y: 270, numero: '5' },
      { x: 209, y: 345, numero: '6' },
      { x: 290, y: 345, numero: '7' },
      { x: 380, y: 345, numero: '8' },
      { x: 475, y: 345, numero: '9' },
      { x: 565, y: 345, numero: '10' }
    ]

    // Para cada sala, adiciona o botão de seleção
    this.salas.forEach(sala => {
      sala.botao = this.physics.add.sprite(sala.x, sala.y, 'nada')
        .setInteractive()
        .on('pointerdown', () => {
          // Remove os textos das salas
          this.salas.forEach(sala => {
            sala.botao.destroy()
          })

          // Toca o som de início
          this.iniciar.play()

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
        //        this.mensagem.setText('Conectando...')

        // Define a variável global dos jogadores
        globalThis.game.jogadores = jogadores

        // Para a cena atual e inicia a cena do mapa
        this.scene.stop('sala')
        this.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        //        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }

  update () {
  }
}
