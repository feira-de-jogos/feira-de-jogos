export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    this.load.image('finalfeliz', './assets/Final feliz.png')
  }

  create () {
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
    this.add.image(400, 225, 'finalfeliz')
      .setInteractive()
      .on('pointerdown', () => {
        location.reload()
      })
      .setInteractive()
      .on('pointerdown', () => {
        location.reload()
      })

    // Inicializa o Google Sign-In
    google.accounts.id.initialize({
      client_id: '699382354082-lhaigg6t2aig8lc3ue63q0kbs5etsd8s.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 14, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 25 // crédito em tijolinhos
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Parabéns! Você conseguiu! Seus tijolinhos foram creditados!')
            })
            .catch(function (error) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Erro ao creditar tijolinhos:', error)
            })
        }
      }
    })

    // Exibe o prompt de login
    globalThis.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.prompt()
      }
    })
  }

  update () { }
}
