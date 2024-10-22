export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
    this.load.image('abertura', 'assets/abertura.png')
    this.load.image('personagem', 'assets/personagem.png')
    this.load.image('sala', 'assets/sala.png')

    this.load.spritesheet('personagem', 'assets/personagem.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create () {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    this.tilesetEstrutura = this.tilemapMapa.addTilesetImage('mapa lab-zumbi')
    // this.tilesetBarreiras = this.tilemapMapa.addTilesetImage('labirinto')
    // this.tilesetChão = this.tilemapMapa.addTilesetImage('mapa lab-zumbii')
    // this.tilesetPersonagem = this.tilemapMapa.addTilesetImage('personagem')

    this.anims.create({
      key: 'parado',
      frames: [{ key: 'personagem', frame: 15 }],
      frameRate: 1
    })

    this.anims.create({
      key: 'andar-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 88, end: 96 }),
      frameRate: 10,
      repeat: -1
    })

    this.personagem = this.physics.add.sprite(50, 225, 'personagem', 15)

    this.cima = this.add.sprite(100, 250, 'cima', 0)
    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
    this.direita = this.add.sprite(700, 350, 'direita', 0)
  }
}