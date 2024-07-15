export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapaindustrial.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tileindustrial64pxgeral.png')

    // Carregar spritesheets
    this.load.spritesheet('personagem', './assets/personagens/Alex.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocoquebra', './assets/animacoes/card.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create () {
    // Adiciona ponteiro
    this.input.addPointer(3)

    // Cria objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetGeral = this.tilemapMapa.addTilesetImage('geral')

    // Camadas do mapa e personagem
    this.layerchao = this.tilemapMapa.createLayer('chao', [this.tilesetGeral])
    this.layerparedes = this.tilemapMapa.createLayer('paredes', [this.tilesetGeral])

    // Define o atributo do tileset para gerar colisão
    this.layerparedes.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    //this.physics.add.collider(this.personagem, this.layerparedes)
  }

  update () { }
}
