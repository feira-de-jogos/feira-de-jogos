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

    // Adiciona as salas
    this.salas = [
      { x: 200, y: 200, numero: '1' },
      { x: 300, y: 200, numero: '2' },
      { x: 400, y: 200, numero: '3' },
      { x: 500, y: 200, numero: '4' },
      { x: 600, y: 200, numero: '5' },
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

          // Variavel global da sala:
          globalThis.game.sala = sala.numero

          // Emite o evento de entrar na sala
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

  update () { }
}
