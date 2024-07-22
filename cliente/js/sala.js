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
        fontSize: '38px',
        fill: '#00A0FF',
        fontFamily: 'Courier New'
      })
        .setInteractive()
        .on('pointerdown', () => {
          // Remove os textos das salas
          this.salas.forEach(sala => {
            sala.texto.destroy()
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
        //this.mensagem.setText('Conectando...')

        // Define a variável global dos jogadores
        globalThis.game.jogadores = jogadores

        // Para a cena atual e inicia a cena do mapa
        globalThis.game.scene.stop('sala')
        globalThis.game.scene.start('finalFeliz')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }
}