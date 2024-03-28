export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.tilemapTiledJSON('mapa', '/assets/mapa/MapaProvisorio.json')

    this.load.image('BlocosCenarioVerde', './assets/mapa/BlocosCenarioVerde.png')
    this.load.image('BlocosBordas', './assets/mapa/BlocosBordas.png')
    this.load.image('FundoCavernaAzul', './assets/mapa/FundoCavernaAzul.png')
    this.load.image('FundoCavernaAzul2', './assets/mapa/FundoCavernaAzul2.png')

    this.load.spritesheet('Boneco', './assets/Boneco.png', { frameWidth: 96, frameHeight: 64 })

    // ao ter o mapa pronto, basta adiciona-lo no final deste código acima. Lembrando que o mapa irá estar no assets>>mapa
    // lembrando também que temos que colocar todos os assets dentro do preload, através do comando this.preload.image('')
  }

  create () {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // agora precisamos dar um this.tilsetOBJETO (este objeto seria o bloco, grama, etc)=this.tilemapMapa.addTilset.Image('Bloco,grama,etc')

    this.tilesetBlocosBordas = this.tilemapMapa.addTilesetImage('BlocosBordas')
    this.tilesetBlocosCenarioVerde = this.tilemapMapa.addTilesetImage('BlocosCenarioVerde')
    this.tilesetFundoCavernaAzul = this.tilemapMapa.addTilesetImage('FundoCavernaAzul')
    this.tilesetFundoCavernaAzul2 = this.tilemapMapa.addTilesetImage('FundoCavernaAzul2')

    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetFundoCavernaAzul, this.tilesetBlocosBordas, this.tilesetFundoCavernaAzul2])
    this.layerChao = this.tilemapMapa.createLayer('Chao', [this.tilesetBlocosCenarioVerde])

    this.personagem = this.physics.add.sprite(200, 410, 'Boneco')
    this.cameras.main.startFollow(this.personagem)

    // parado direita
    this.anims.create({
      key: 'boneco_parado_direita',
      frames: this.anims.generateFrameNumbers('Boneco', { start: 12, end: 12 }),
      frameRate: 1,
      repeat: -1
    })

    // andando para direita
    this.anims.create({
      key: 'boneco_andando_direita',
      frames: this.anims.generateFrameNumbers('Boneco', { start: 12, end: 17 }),
      frameRate: 5,
      repeat: -1
    })

    // parado esquerda
    this.anims.create({
      key: 'boneco_parado_esquerda',
      frames: this.anims.generateFrameNumbers('Boneco', { start: 4, end: 4 }),
      frameRate: 5,
      repeat: -1
    })

    // andando para esquerda
    this.anims.create({
      key: 'boneco_andando_esquerda',
      frames: this.anims.generateFrameNumbers('Boneco', { start: 4, end: 0 }),
      frameRate: 5,
      repeat: -1
    })

    this.personagem
      .setInteractive()
      .on('pointerdown', () => {
        this.personagem.anims.play('boneco_andando_direita')
        this.personagem.setVelocityX(100)
      })
  }

  update () {

  }
}
