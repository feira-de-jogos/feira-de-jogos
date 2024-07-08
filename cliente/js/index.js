import config from './config.js'
import abertura from './abertura.js'
import sala from './sala.js'
import mapa from './mapa.js'

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
    this.scene.start('abertura')
  }
}

window.onload = () => {
  window.game = new Game()
}
