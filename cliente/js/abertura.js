export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('telainicial', './assets/telainicial.png')
  }

  create () {
    this.add.image(400, 225, 'telainicial')
      .setInteractive()
      .on('pointerdown', () => {
        this.game.scene.stop('abertura')
        this.game.scene.start('sala')
      })
  }

  update () { }
}
