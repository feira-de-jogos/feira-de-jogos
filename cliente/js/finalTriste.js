export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () { 
    this.load.image('CenaMorte', './assets/Cenas/CenaMorte.png')
  }

  create () {
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.image(427, 240, 'CenaMorte')
      .setInteractive()
      .on('pointerdown', () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))
      })
  }

  update () { }
}
