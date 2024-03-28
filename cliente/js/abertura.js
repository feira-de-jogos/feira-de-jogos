export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('abertura1', './assets/abertura1.png')
  }

  create () {
    this.add.image(400, 225, 'abertura1')
      .setInteractive()
      .on('pointerdown', () => {
        this.game.scene.stop('abertura')
        this.game.scene.start('sala')
      })
  }

  update () { }
}
