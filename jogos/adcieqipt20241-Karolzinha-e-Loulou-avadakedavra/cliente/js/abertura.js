import Phaser from 'phaser'

export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('abertura', './assets/abertura.png')
  }

  create () {
    this.add.image(400, 225, 'abertura')
      .setInteractive()
      .on('pointerdown', () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))

        this.scene.stop('abertura')
        this.scene.start('sala')
      })
  }
}
