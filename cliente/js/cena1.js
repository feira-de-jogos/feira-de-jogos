export default class cena1 extends Phaser.Scene {
  constructor () {
    super('cena1')
  }

  preload () {
    this.load.image('escola2', './assets/escola2.png')
    this.load.spritesheet('amy', './assets/amy.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('jake', './assets/jake.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('georgina', './assets/georgina.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('lara', './assets/lara.png', { frameWidth: 160, frameHeight: 220 })
  }

  create () {
    this.add.image(400, 225, 'escola2')
    this.personagem = this.add.sprite(100, 300, 'amy').setScale (1.5)

    this.anims.create({
      key: 'amy-falando',
      frames: this.anims.generateFrameNumbers('amy', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.personagem.anims.play('amy-falando')

    this.personagem = this.add.sprite(300, 300, 'jake').setScale(1.5)

    this.anims.create({
      key: 'jake-falando',
      frames: this.anims.generateFrameNumbers('jake', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.personagem.anims.play('jake-falando')

    this.personagem = this.add.sprite(500, 275, 'georgina').setScale(1.65)

    this.anims.create({
      key: 'georgina-falando',
      frames: this.anims.generateFrameNumbers('georgina', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.personagem.anims.play('georgina-falando')

    this.personagem = this.add.sprite(700, 300, 'lara').setScale(1.5)

    this.anims.create({
      key: 'lara-falando',
      frames: this.anims.generateFrameNumbers('lara', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.personagem.anims.play('lara-falando')
  }
}
