import config from './config.js'
import abertura from './abertura.js'
import sala from './sala.js'
import mapa from './mapa.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    let iceServers
    if (window.location.host === 'feira-de-jogos.dev.br') {
      this.socket = io({ path: '/jogo/socket.io/' })
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
    this.scene.start('mapa')
  }
}

window.onload = () => {
  window.game = new Game()
}
