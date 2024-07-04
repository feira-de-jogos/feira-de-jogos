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
    this.mensagem = this.add.text(100, 50, 'Sala 1', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive() // Permite que o texto seja clicável
      .on('pointerdown', () => {
    
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
