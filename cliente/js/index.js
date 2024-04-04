import config from './config.js'
import abertura from './abertura.js'
import sala from './sala.js'
import cena2 from './cena2.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.scene.add('abertura', abertura)
    this.scene.add('sala', sala)
    this.scene.add('cena2', cena2)
    this.scene.start('cena2')
  }
}

window.onload = () => {
  window.game = new Game()
}
