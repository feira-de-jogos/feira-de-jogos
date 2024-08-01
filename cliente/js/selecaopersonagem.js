xport default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('selecaoPersonagem')
  }

  preload () {
    this.load.image('selecaoPersonagem', './assets/cenas/teladeselecao.png')
  }

  create () {
    this.add.image(427, 240, 'selecaoPersonagem')
      .setInteractive()
      .on('pointerdown', () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))
      })
  }

  update () { 

  }

}
