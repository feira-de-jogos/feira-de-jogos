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

    let iceServers
    if (window.location.host === 'feira-de-jogos.dev.br') {
      this.socket = io({ path: '/adcieqipt20241/socket.io/' })
      iceServers = [
        {
          urls: 'stun:feira-de-jogos.dev.br'
        }
      ]
    } else {
      this.socket = io()
      iceServers = [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    }
    this.iceServers = { iceServers }

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
