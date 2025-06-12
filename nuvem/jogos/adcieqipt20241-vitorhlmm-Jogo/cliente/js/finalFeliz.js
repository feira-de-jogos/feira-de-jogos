import Phaser from 'phaser'
import axios from 'axios'

export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    // carrega a cena de fenal feliz
    this.load.spritesheet('FinalFeliz', './assets/FinalFeliz.png', { frameWidth: 800, frameHeight: 450 })
  }

  create () {
    this.anims.create({
      key: 'cenafinalfeliz',
      frames: this.anims.generateFrameNumbers('FinalFeliz', {
        start: 0,
        end: 6
      }),
      frameRate: 10,
      repeat: -1
    })

    this.add.sprite(400, 225, 'FinalFeliz').anims.play('cenafinalfeliz')
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    globalThis.google.accounts.id.initialize({
      client_id: '331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 9, // id do jogo cadastrado no banco de dados da Feira de Jogos
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
              console.error(error)
            })
          // Adiciona o som
          this.feliz = this.sound.add('feliz').play()
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
