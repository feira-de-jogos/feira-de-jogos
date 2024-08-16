export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    this.load.image('CenaVitoria', './assets/Cenas/CenaVitoria.png')
  }

  // colocar após a barrinha o plano de fundo, lembrando que deve importa-lo para o assets

  create () {
    this.add.image(427, 240, 'CenaVitoria')
      .setInteractive()
      .on('pointerdown', () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))
      })

    // Inicializa o Google Sign-In
    google.accounts.id.initialize({
      client_id: '540311140019-tg7huvct6tsv483cgrjfuul3fhtib574.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          globalThis.game.jwt = jwtDecode(res.credential)
          this.mensagem.setText(`Parabéns, ${globalThis.game.jwt.given_name}!`)
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
