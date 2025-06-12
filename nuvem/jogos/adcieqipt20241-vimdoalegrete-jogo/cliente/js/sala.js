export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    // Carrega os sons
    this.load.audio('iniciar', './assets/iniciar.mp3')
    this.load.audio('mapa', './assets/mapa.mp3')

    // Carrega a imagem de fundo
    this.load.image('Fundo sala', './assets/Fundo sala.png')
  }

  create () {
    // Define os objetos de som
    this.iniciar = this.sound.add('iniciar')
    this.musicaMapa = this.sound.add('mapa', { loop: true })
    this.musicaMapa.play()

    // Adiciona a imagem de fundo
    this.add.image(400, 225, 'Fundo sala')

    // Adiciona o texto da sala
    this.mensagem = this.add.text(200, 160, 'Escolha a sala:', {
      fontSize: '32px',
      fill: '#ffffff', // Cor chamativa
      fontFamily: 'Comic Sans MS',
      stroke: '#1C1C1C', // Cor da borda
      strokeThickness: 4 // Espessura da borda
    })

    // Adiciona as salas
    this.salas = [
      { x: 220, y: 220, numero: '1' },
      { x: 300, y: 220, numero: '2' },
      { x: 380, y: 220, numero: '3' },
      { x: 460, y: 220, numero: '4' },
      { x: 540, y: 220, numero: '5' },
      { x: 220, y: 330, numero: '6' },
      { x: 300, y: 330, numero: '7' },
      { x: 380, y: 330, numero: '8' },
      { x: 460, y: 330, numero: '9' },
      { x: 540, y: 330, numero: '10' }
    ]

    // Para cada sala, adiciona o botão de seleção
    this.salas.forEach(sala => {
      sala.texto = this.add.text(sala.x, sala.y, sala.numero, {
        fontSize: '32px',
        fill: '#ffffff', // Cor chamativa
        fontFamily: 'Comic Sans MS',
        stroke: '#ffffff', // Cor da borda
        strokeThickness: 4, // Espessura da borda
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 2,
          stroke: true,
          fill: true
        }
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
          globalThis.game.sala = 'adcieqipt20241-vimdoalegrete-jogo/' + sala.numero

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
        this.scene.stop('sala')
        this.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }

  update () {
  }
}
