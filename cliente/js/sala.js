export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar', './assets/iniciar.mp3')
    this.load.audio('mapa', './assets/mapa.mp3')

    this.load.image('escola', './assets/escola.png')
  }

  create () {
    this.iniciar = this.sound.add('iniciar')
    this.trilha = this.sound.add('mapa', { loop: true })
    this.trilha.play()

    this.add.image(400, 225, 'escola')

    this.add.text(100, 50, 'sala1')
      .setInteractive()
      .on('pointerdown', () => {
        this.trilha.stop()
        this.iniciar.play()
        this.game.scene.stop('sala')
        this.game.scene.start('cena2')
        this.iniciar.stop()
      })
  }

  update () {
  }
}
