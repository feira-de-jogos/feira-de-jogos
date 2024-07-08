export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    // Carrega os sons
    this.load.audio('iniciar', './assets/iniciar.mp3')
    this.load.audio('mapa', './assets/mapa.mp3')

    // Carrega a imagem de fundo
    this.load.image('fundo', './assets/fundo.png')
  }

  create () {
    // Define os objetos de som
    this.iniciar = this.sound.add('iniciar')
    this.musicaMapa = this.sound.add('mapa', { loop: true })
    this.musicaMapa.play()

    // Adiciona a imagem de fundo
    this.add.image(400, 225, 'fundo')

    // Adiciona o texto da sala
    this.mensagem = this.add.text(100, 50, 'Sala 1', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    }).setInteractive() // Permite que o texto seja clicável

    // Evento de clique no texto
    this.mensagem.on('pointerdown', () => {
      this.iniciar.play()

      // Define a variável global da sala
      globalThis.game.sala = 1

      // Emite o evento de entrar na sala
      globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)
    })

    // Define o evento de recebimento da mensagem 'jogadores'
    globalThis.game.socket.on('jogadores', (jogadores) => {
      // Define a variável global dos jogadores
      globalThis.game.jogadores = jogadores

      if (jogadores.segundo) {
        // Se o segundo jogador já estiver conectado, inicia o jogo
        this.mensagem.setText('Conectando...')

        // Para a cena atual e inicia a cena do mapa
        this.scene.stop('sala')
        this.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }

  update () {
    // Adicione lógica para ser executada a cada quadro, se necessário
  }
}
