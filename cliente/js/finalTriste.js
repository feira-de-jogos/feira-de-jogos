//import Phaser from 'phaser'
export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () {
    this.load.image('finalTriste', './assets/Cenas/finalTriste.png')
  }

  create () {
    this.somderrota.play()
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.image(450, 220, 'finalTriste')
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })
  }

  update () { }
}
