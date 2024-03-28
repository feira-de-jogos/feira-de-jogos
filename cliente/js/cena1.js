export default class cena1 extends Phaser.Scene {
  constructor () {
    super('cena1')
  }

  preload () {
    this.load.image('escola', './assets/escola.png')
    this.load.spritesheet('amy', './assets/amy.png', { frameWidth: 160, frameHeight: 220 })
  }

  create () {
    this.add.image(400, 225, 'escola')
    this.personagem = this.add.sprite(100, 345, 'amy')

    this.anims.create({
      key: 'amy-falando',
      frames: this.anims.generateFrameNumbers('amy', { start: 0, end: 5 }),
      frameRate: 3,
      repeat: -1
    })

    this.personagem.anims.play('amy-falando')
  }
}
