import Phaser from 'phaser'
export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () {
    this.load.image('CenaMorte', './assets/Cenas/CenaMorte.png')
  }

  create () {
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.image(900, 471, 'CenaMorte')
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })
  }

  update () { }
}
