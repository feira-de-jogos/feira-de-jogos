export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    // música de abertura:
    this.load.audio('iniciar', './assets/audio.mp3')

    // Abertura:
    this.load.image('abertura', './assets/Cenas/CenadeJogos.png')
  }

  create () {
    // música de iniciar o jogo:
    this.iniciar = this.sound.add('iniciar')

    // Imagem de abertura do jogo:
    this.add.image(427, 240, 'abertura')

    // texto da sala:
    this.mensagem = this.add.text(100, 50, 'sala 1', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Times New Roman'
    })

      // Torna o botão interativo:
      .setInteractive()
      .on('pointerdown', () => {
        this.iniciar.play()

        // Variavel global da sala:
        globalThis.game.sala = 1

        // Emite o evento de entrar na sala
        globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)

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
      })
  }

  update () {
  }
}
