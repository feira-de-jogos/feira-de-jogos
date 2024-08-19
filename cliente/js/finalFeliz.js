import Phaser from 'phaser'
import axios from 'axios'

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
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    globalThis.google.accounts.id.initialize({
      client_id: '540311140019-tg7huvct6tsv483cgrjfuul3fhtib574.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 8, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 300 // crédito em tijolinhos
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              console.log(response)
            })
            .catch(function (error) {
              console.error(error)
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
