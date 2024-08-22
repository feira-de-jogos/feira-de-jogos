export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar', './assets/sons/iniciar.mp3')
    this.load.image('espaço', './assets/espaço.png')
    this.load.image('aguardando', './assets/aguardando.png')
    this.load.image('nada', './assets/nada.png')
  }

  create () {
    // Define o objeto de som e toca
    this.iniciar = this.sound.add('iniciar')
    this.iniciar.play()

    // Adiciona a imagem de fundo
    this.aguardando = this.add.image(400, 225, 'aguardando')
    this.espaco = this.add.image(400, 225, 'espaço')

    // Adiciona as salas
    this.salas = [
      { x: 225, y: 225, numero: '1' },
      { x: 305, y: 225, numero: '2' },
      { x: 390, y: 225, numero: '3' },
      { x: 470, y: 225, numero: '4' },
      { x: 555, y: 225, numero: '5' },
      { x: 227, y: 288, numero: '6' },
      { x: 305, y: 288, numero: '7' },
      { x: 383, y: 288, numero: '8' },
      { x: 463, y: 288, numero: '9' },
      { x: 555, y: 288, numero: '10' }
    ]

    // Para cada sala, adiciona o botão de seleção
    this.salas.forEach(sala => {
      sala.botao = this.add.sprite(sala.x, sala.y, 'nada')
        .setInteractive()
        .on('pointerdown', () => {
          // Remove os textos das salas
          this.salas.forEach(sala => {
            sala.botao.destroy()
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
        //        this.mensagem.setText('Conectando...')

        // Define a variável global dos jogadores
        globalThis.game.jogadores = jogadores

        // Para a cena atual e inicia a cena do cutscene
        this.scene.stop('sala')
        this.iniciar.stop()
        this.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.espaco.setVisible(false)
      }
    })

  }

  update () {
  }
}
