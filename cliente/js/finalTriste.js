import Phaser from 'phaser'

export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () { }

  create () {
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.text(100, 50, 'Você não conseguiu!', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })
  }

  update () { }
}
