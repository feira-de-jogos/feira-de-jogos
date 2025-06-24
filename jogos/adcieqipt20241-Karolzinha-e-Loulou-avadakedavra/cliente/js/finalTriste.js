import Phaser from 'phaser'

export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () {
    this.load.image('finalTriste', './assets/finalTriste.png')
  }

  create () {
    this.add.image(400, 225, 'finalTriste')
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })
  }

  update () { }
}
