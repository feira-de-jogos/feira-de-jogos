export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.image('fundo', './assets/fundo.png')
    this.load.audio('iniciar', './assets/iniciar.mp3')
  }

  create () {
    this.iniciar = this.sound.add('iniciar')
    this.add.image(400, 255, 'fundo')
    this.mensagem = this.add.text(100, 50, 'sala 1').setInteractive()
      .on('pointerdown', () => {
        // Toca o som
        this.iniciar.play()

        // Define a variável global da sala
        globalThis.game.sala = 1

        // Emite o evento de entrar na sala
        globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)
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
