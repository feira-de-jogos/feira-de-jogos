import Phaser from 'phaser'

export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () {
    // carrega a cena de fenal trsite
    this.load.spritesheet('FinalTriste', './assets/FinalTriste.png', { frameWidth: 800, frameHeight: 450 })

    // Carrega o som de final triste
    this.load.audio('triste', './assets/triste.mp3')
  }

  create () {
    // Adiciona o som
    this.triste = this.sound.add('triste', { loop: true }).play()

    this.anims.create({
      key: 'cenafinaltriste',
      frames: this.anims.generateFrameNumbers('FinalTriste', {
        start: 0,
        end: 6
      }),
      frameRate: 10,
      repeat: -1
    })

    this.add.sprite(400, 225, 'FinalTriste').anims.play('cenafinaltriste')
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })
    // Adiciona o som
    this.triste = this.sound.add('triste', { loop: true }).play()
  }

  update () { }
}
