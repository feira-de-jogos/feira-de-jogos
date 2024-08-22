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
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))

        this.scene.stop('abertura')
        this.scene.start('sala')
      })
  }

  update () {
  }
}
