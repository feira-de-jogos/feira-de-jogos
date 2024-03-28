export default class abertura extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')
    this.load.image('itens', './assets/mapa/itens.png')

    this.load.spritesheet('salsicha-caramelo', './assets/salsicha-caramelo.png', { frameWidth: 64, frameHeight: 64 })
  }

  create () {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')

    this.layerItens = this.tilemapMapa.createLayer('itens', [this.tilesetItens])
    // É necessário deixar claro no código qual tileset foi utilizado em cada camada e referenciá-lo

    this.personagem = this.physics.add.sprite(400, 225, 'salsicha-caramelo')

    // Essa parte do código cria a animação do personagem
    this.anims.create({
      key: 'salsicha-caramelo-parado',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'salsicha-caramelo-direita',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 3, end: 1 }),
      frameRate: 7,
      repeat: -1
    })

    this.anims.create({
      key: 'salsicha-caramelo-esquerda',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 8, end: 6 }),
      frameRate: 7,
      repeat: -1
    })
    this.personagem.anims.play('salsicha-caramelo-parado')

    this.personagem
      .setInteractive()
      .on('pointerdown', () => {
      
        this.personagem.anims.play('salsicha-caramelo-esquerda')
        this.personagem.setVelocityY(50)
        this.personagem.setVelocityX(0)
      })
    this.cameras.main.startFollow(this.personagem)
  }
}

// update () {
