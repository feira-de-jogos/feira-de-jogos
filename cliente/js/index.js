import config from './config.js'
import abertura from './abertura.js'
import sala from './sala.js'
import mapa from './mapa.js'
import finalFeliz from './finalFeliz.js'
import finalTriste from './finalTriste.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.audio = document.querySelector('audio')
    this.iceServers = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    }

    // eslint-disable-next-line no-undef
    this.socket = io()
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor!')
    })

    this.scene.add('abertura', abertura)
    this.scene.add('sala', sala)
    this.scene.add('mapa', mapa)
    this.scene.add('finalFeliz', finalFeliz)
    this.scene.add('finalTriste', finalTriste)
    this.scene.start('abertura')
  }
}

window.onload = () => {
  window.game = new Game()
}
