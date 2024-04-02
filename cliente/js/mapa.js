export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // lembrando que temos que carregar o som como primeiro de tudo, até acima do mapa, apartir do mesmo comando:
    // this.load.audio()
    this.load.tilemapTiledJSON('mapa', '/assets/mapa/MapaProvisorio.json')

    this.load.image('BlocosCenarioVerde', './assets/mapa/BlocosCenarioVerde.png')
    this.load.image('BlocosBordas', './assets/mapa/BlocosBordas.png')
    this.load.image('FundoCavernaAzul', './assets/mapa/FundoCavernaAzul.png')
    this.load.image('FundoCavernaAzul2', './assets/mapa/FundoCavernaAzul2.png')

    this.load.spritesheet('Boneco', './assets/Boneco.png', { frameWidth: 96, frameHeight: 64 })

    // movimentação do personagem
    this.load.spritesheet('cima', './assets/Controles/SetaCima.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('esquerda', './assets/Controles/SetaEsq.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('direita', './assets/Controles/SetaDir.png', { frameWidth: 64, frameHeight: 64 })

    // ao ter o mapa pronto, basta adiciona-lo no final deste código acima. Lembrando que o mapa irá estar no assets>>mapa
    // lembrando também que temos que colocar todos os assets dentro do preload, para assim podermos carrega-los através do comando this.preload.image('')
  }

  create () {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // agora precisamos dar um this.tilsetOBJETO (este objeto seria o bloco, grama, etc)=this.tilemapMapa.addTilset.Image('Bloco,grama,etc')
    this.tilesetBlocosBordas = this.tilemapMapa.addTilesetImage('BlocosBordas')
    this.tilesetBlocosCenarioVerde = this.tilemapMapa.addTilesetImage('BlocosCenarioVerde')
    this.tilesetFundoCavernaAzul = this.tilemapMapa.addTilesetImage('FundoCavernaAzul')
    this.tilesetFundoCavernaAzul2 = this.tilemapMapa.addTilesetImage('FundoCavernaAzul2')

    // fundo e chão do mapa
    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetFundoCavernaAzul, this.tilesetBlocosBordas, this.tilesetFundoCavernaAzul2])
    this.layerChao = this.tilemapMapa.createLayer('Chao', [this.tilesetBlocosCenarioVerde])

    // personagem:
    this.personagem = this.physics.add.sprite(200, 410, 'Boneco')

    // após, segue o código para a criação da camera que irá serguir o personagem
    this.cameras.main.startFollow(this.personagem)

    // parado direita
    this.anims.create
      ({
        key: 'boneco_parado_direita',
        frames: this.anims.generateFrameNumbers('Boneco', { start: 12, end: 12 }),
        frameRate: 1,
        repeat: -1
      })

    // andando para direita
    this.anims.create
      ({
        key: 'boneco_andando_direita',
        frames: this.anims.generateFrameNumbers('Boneco', { start: 12, end: 17 }),
        frameRate: 5,
        repeat: -1
      })

    // parado esquerda
    this.anims.create
      ({
        key: 'boneco_parado_esquerda',
        frames: this.anims.generateFrameNumbers('Boneco', { start: 4, end: 4 }),
        frameRate: 5,
        repeat: -1
      })

    // andando para esquerda
    this.anims.create
      ({
        key: 'boneco_andando_esquerda',
        frames: this.anims.generateFrameNumbers('Boneco', { start: 4, end: 0 }),
        frameRate: 5,
        repeat: -1
      })

    // movimentação do personagem
    this.cima = this.add.sprite(320, 225, 'cima', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.cima.setFrame(1)
        this.personagem.setVelocityY(-50)
      })

      .on('pointerout', () => {
        this.cima.setFrame(0)
        this.personagem.setVelocityY(0)
      })

    // personagem andando para direita ao clicar
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
