export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // lembrando que temos que carregar o som como primeiro de tudo, até acima do mapa, apartir do mesmo comando:
    // this.load.audio()
    this.load.tilemapTiledJSON('mapa', '/assets/mapa/Mapa.json')

    this.load.image('BlocosCenarioVerde', './assets/mapa/BlocosCenarioVerde.png')
    this.load.image('BlocosCenarioAmarelo', './assets/mapa/BlocosCenarioAmarelo.png')
    this.load.image('BlocosCenarioVermelho', './assets/mapa/BlocosCenarioVermelho.png')
    this.load.image('BlocosCenarioAzul', './assets/mapa/BlocosCenarioAzul.png')
    this.load.image('BlocosCenarioRoxo', './assets/mapa/BlocosCenarioRoxo.png')
    this.load.image('BlocosMorte', './assets/mapa/BlocosMorte.png')
    this.load.image('BlocosTeto', './assets/mapa/BlocosTeto.png')
    this.load.image('BlocosBordas', './assets/mapa/BlocosBordas.png')
    this.load.image('Gramas', './assets/mapa/Gramas.png')
    this.load.image('GramasAmarela', './assets/mapa/GramasAmarela.png')
    this.load.image('GramasAzul', './assets/mapa/GramasAzul.png')
    this.load.image('GramasVermelho', './assets/mapa/GramasVermelho.png')
    this.load.image('GramasRoxo', './assets/mapa/GramasRoxo.png')
    this.load.image('Pedrinhas', './assets/mapa/Pedrinhas.png')
    this.load.image('FundoCavernaAzul', './assets/mapa/FundoCavernaAzul.png')
    this.load.image('FundoCavernaRoxa', './assets/mapa/FundoCavernaRoxa.png')
    this.load.image('FundoCavernaVerde', './assets/mapa/FundoCavernaVerde.png')
    this.load.image('FundoCavernaVermelho', './assets/mapa/FundoCavernaVermelho.png')
    this.load.image('FundoCavernaAmarela', './assets/mapa/FundoCavernaAmarela.png')

    this.load.spritesheet('BenPlayer1', './assets/BenPlayer1.png', { frameWidth: 48, frameHeight: 64 })

    // movimentação do personagem
    this.load.spritesheet('cima', './assets/Controles/SetaCima.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('esquerda', './assets/Controles/SetaEsq.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('direita', './assets/Controles/SetaDir.png', { frameWidth: 128, frameHeight: 128 })

    // ao ter o mapa pronto, basta adiciona-lo no final deste código acima. Lembrando que o mapa irá estar no assets>>mapa
    // lembrando também que temos que colocar todos os assets dentro do preload, para assim podermos carrega-los através do comando this.preload.image('')
  }

  create () {
    // adiciona o ponteiro de toque:
    this.input.addPointer(3)

    // som de fundo:
    // this.sound.add('musica mapa', {loop:true}).play()

    // cria o objeto tilemap (mapa)
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // agora precisamos dar um this.tilsetOBJETO (este objeto seria o bloco, grama, etc)=this.tilemapMapa.addTilset.Image('Bloco,grama,etc')
    this.tilesetBlocosBordas = this.tilemapMapa.addTilesetImage('BlocosBordas')
    this.tilesetBlocosCenarioVerde = this.tilemapMapa.addTilesetImage('BlocosCenarioVerde')
    this.tilesetBlocosCenarioAmarelo = this.tilemapMapa.addTilesetImage('BlocosCenarioAmarelo')
    this.tilesetBlocosCenarioVermelho = this.tilemapMapa.addTilesetImage('BlocosCenarioVermelho')
    this.tilesetBlocosCenarioAzul = this.tilemapMapa.addTilesetImage('BlocosCenarioAzul')
    this.tilesetBlocosCenarioRoxo = this.tilemapMapa.addTilesetImage('BlocosCenarioRoxo')
    this.tilesetBlocosMorte = this.tilemapMapa.addTilesetImage('BlocosMorte')
    this.tilesetBlocosTeto = this.tilemapMapa.addTilesetImage('BlocosTeto')
    this.tilesetFundoCavernaAzul = this.tilemapMapa.addTilesetImage('FundoCavernaAzul')
    this.tilesetFundoCavernaRoxa = this.tilemapMapa.addTilesetImage('FundoCavernaRoxa')
    this.tilesetFundoCavernaVerde = this.tilemapMapa.addTilesetImage('FundoCavernaVerde')
    this.tilesetFundoCavernaVermelho = this.tilemapMapa.addTilesetImage('FundoCavernaVermelho')
    this.tilesetFundoCavernaAmarela = this.tilemapMapa.addTilesetImage('FundoCavernaAmarela')
    this.tilesetGramas = this.tilemapMapa.addTilesetImage('Gramas')
    this.tilesetGramasAmarela = this.tilemapMapa.addTilesetImage('GramasAmarela')
    this.tilesetGramasAzul = this.tilemapMapa.addTilesetImage('GramasAzul')
    this.tilesetGramasVermelho = this.tilemapMapa.addTilesetImage('GramasVermelho')
    this.tilesetGramasRoxo = this.tilemapMapa.addTilesetImage('GramasRoxo')
    this.tilesetPedrinhas = this.tilemapMapa.addTilesetImage('Pedrinhas')

    // fundo e chão do mapa
    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetFundoCavernaAzul, this.tilesetFundoCavernaRoxa, this.tilesetFundoCavernaVerde, this.tilesetFundoCavernaVermelho, this.tilesetFundoCavernaAmarela, this.tilesetBlocosBordas])
    this.layerChao = this.tilemapMapa.createLayer('Chao', [this.tilesetBlocosCenarioVerde, this.tilesetBlocosCenarioAmarelo, this.tilesetBlocosCenarioVermelho, this.tilesetBlocosCenarioAzul, this.tilesetBlocosCenarioRoxo])
    this.layerParedes = this.tilemapMapa.createLayer('Paredes', [this.tilesetBlocosTeto])
    this.layerObstaculos = this.tilemapMapa.createLayer('Obstaculos', [this.tilesetBlocosMorte])

    // personagem:
    this.personagem = this.physics.add.sprite(3065, 2656, 'BenPlayer1')
    this.personagemLado = 'direita'

    // Pedrinhas e Gramas:
    this.layerDetalhes = this.tilemapMapa.createLayer('Detalhes', [this.tilesetPedrinhas, this.tilesetGramas, this.tilesetGramasAmarela, this.tilesetGramasAzul, this.tilesetGramasVermelho, this.tilesetGramasRoxo])

    // movimentação do personagem:

    // parado direita
    this.anims.create({
      key: 'BenPlayer1_parado_direita',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    })

    // parado esquerda
    this.anims.create({
      key: 'BenPlayer1_parado_esquerda',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 4, end: 5 }),
      frameRate: 1,
      repeat: -1
    })

    // andando para direita
    this.anims.create({
      key: 'BenPlayer1_andando_direita',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 2, end: 3 }),
      frameRate: 2,
      repeat: -1
    })

    // andando para esquerda
    this.anims.create({
      key: 'BenPlayer1_andando_esquerda',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1
    })

    // Pulando para direita:
    this.anims.create({
      key: 'BenPlayer1_pulando_direita',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 9, end: 9 }),
      frameRate: 1
    })

    // pulando para esquerda
    this.anims.create({
      key: 'BenPlayer1_pulando_esquerda',
      frames: this.anims.generateFrameNumbers('BenPlayer1', { start: 8, end: 8 }),
      frameRate: 1
    })

    // Pulo para direita:

    this.cima = this.add.sprite(800, 375, 'cima', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.cima.setFrame(1)
        if (this.personagem.body.blocked.down) {
          this.personagem.setVelocityY(-550)
          this.personagem.anims.play('BenPlayer1_pulando_' + this.personagemLado)
        }
      })
      .on('pointerout', () => {
        this.cima.setFrame(0)
        this.personagem.anims.play('BenPlayer1_parado_' + this.personagemLado)
      })

    // movimentação direita

    this.direita = this.add.sprite(200, 375, 'direita', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.direita.setFrame(1)
        this.personagem.setVelocityX(180)
        this.personagemLado = 'direita'
        this.personagem.anims.play('BenPlayer1_andando_' + this.personagemLado)
      })
      .on('pointerout', () => {
        this.direita.setFrame(0)
        this.personagem.setVelocityX(0)
        this.personagem.anims.play('BenPlayer1_parado_' + this.personagemLado)
      })

    // Movimentação esquerda

    this.esquerda = this.add.sprite(64, 375, 'esquerda', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.esquerda.setFrame(1)
        this.personagem.setVelocityX(-180)
        this.personagemLado = 'esquerda'
        this.personagem.anims.play('BenPlayer1_andando_' + this.personagemLado)
      })
      .on('pointerout', () => {
        this.esquerda.setFrame(0)
        this.personagem.setVelocityX(0)
        this.personagem.anims.play('BenPlayer1_parado_' + this.personagemLado)
      })

    // colisão de personagem

    this.layerChao.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagem, this.layerChao)

    this.layerParedes.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagem, this.layerParedes)

    // após, segue o código para a criação da camera que irá serguir o personagem
    this.cameras.main.startFollow(this.personagem)
  }

  update () { }
}
