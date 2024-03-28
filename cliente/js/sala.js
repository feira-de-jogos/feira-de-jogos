export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar','./assets/iniciar.mp3')
    this.load.audio('mapa','./assets/mapa.mp3')

    this.load.image('fundo1', './assets/fundo1.png')
  }

  create () {
    this.iniciar = this.sound.add('iniciar')
      this.sound.add('mapa', {loop: true}).play()

    this.add.image(400, 225, 'fundo1')

    this.add.text(100, 50, 'sala1')
      .setInteractive()
      .on('pointerdown', () => {
       this.iniciar.play()
      })
  }

  update () {
  }
}
