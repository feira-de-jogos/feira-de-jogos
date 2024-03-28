export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('fundo', './assets/teste.png')
  } // colocar após a barrinha o plano de fundo, lembrando que deve importa-lo para o assets

  create () {
    this.add.image(427, 240, 'fundo')
      .setInteractive()
      .on('pointerdown', () => {
        this.game.scene.stop('abertura')
        this.game.scene.start('sala')
      })
  }

  update () {

  }
}
