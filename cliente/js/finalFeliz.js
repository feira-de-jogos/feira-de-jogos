import Phaser from 'phaser'
import axios from 'axios'

export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    this.load.image('final', './assets/final.png')
  }

  create () {
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
    this.add.image(400, 375, 'final')
    this.mensagem = this.add.text(100, 50, '', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    globalThis.google.accounts.id.initialize({
      client_id: '366879661071-i20f4pioa4lfaauil8rp6pmopo2mcj2u.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 10, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 300 // crédito em tijolinhos (coloquei 500, confirmar com professor depois)
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
    globalThis.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        globalThis.google.accounts.id.prompt()
      }
    })
  }

  update () { }
}
