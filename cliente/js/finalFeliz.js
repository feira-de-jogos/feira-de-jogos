export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () { }

  create () {
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
    this.mensagem = this.add.text(100, 50, 'Parabéns! Você conseguiu!', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    google.accounts.id.initialize({
      client_id: '331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          globalThis.game.jwt = jwtDecode(res.credential)
          this.mensagem.setText(`Parabéns, ${globalThis.game.jwt.given_name}!`)

          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 8, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 100 // crédito em tijolinhos
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              console.log(response)
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    })

    // Exibe o prompt de login
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.prompt()
      }
    })
  }

  update () { }
}
