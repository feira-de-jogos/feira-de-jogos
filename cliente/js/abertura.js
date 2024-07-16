export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

    preload() {
      this.load.image('fundo', './assets/fundo.png')
    }

    create() {
      this.add.image(400,255,'fundo')
        .setInteractive()
        .on('pointerdown', () => {

          navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))

          //globalThis.game.scale.startFullScreen()
          this.game.scene.stop('abertura')
          this.game.scene.start('sala')
        })
      }

    update(){
    }
}
