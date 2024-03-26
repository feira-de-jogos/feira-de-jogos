export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload() {
    this.load.tilemapTiledJSON('mapa', '/assets/mapa/Mapa-provisorio.json')

    this.load.image('bloco_de_estrada', './assets/mapa/bloco_de_estrada_1.png')
    this.load.image('bloco_de_estrada_2', './assets/mapa/bloco_de_estrada_2.png')
    this.load.image('DeadCells', './assets/DeadCells.png')
    this.load.image('Plataforma_de_estrada_fim_esq_grande', './assets/mapa/Plataforma_de_estrada_fim_esq_grande.png')
    this.load.image('Plataforma_de_estrada_meio', './assets/mapa/Plataforma_de_estrada_meio.png')
    this.load.image('Plataforma_florida_pequena', './assets/mapa/Plataforma_florida_pequena.png')
    this.load.image('Plataforma_grama_pequena', './assets/mapa/Plataforma_grama_pequena.png')
    this.load.image('Plataforma_pedra_pequena', './assets/mapa/Plataforma_pedra_pequena.png')

    // ao ter o mapa pronto, basta adiciona-lo no final deste código acima. Lembrando que o mapa irá estar no assets>>mapa
    // lembrando também que temos que colocar todos os assets dentro do preload, através do comando this.preload.image('')
  }

  create() {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // agora precisamos dar um this.tilsetOBJETO (este objeto seria o bloco, grama, etc)=this.tilemapMapa.addTilset.Image('Bloco,grama,etc')

    this.tilesetblocoDeEstrada = this.tilemapMapa.addTilesetImage('bloco_de_estrada')
    this.tilesetblocoDeEstrada2 = this.tilemapMapa.addTilesetImage('bloco_de_estrada_2')
    this.tilesetDeadCells = this.tilemapMapa.addTilesetImage('DeadCells')
    this.tilesetPlataformaDeEstradaFimEsqGrande = this.tilemapMapa.addTilesetImage('Plataforma_de_estrada_fim_esq_grande')
    this.tilesetPlataformaDeEstradaMeio = this.tilemapMapa.addTilesetImage('Plataforma_de_estrada_meio')
    this.tilesetPlataformaFloridaPequena = this.tilemapMapa.addTilesetImage('Plataforma_florida_pequena')
    this.tilesetPlataformaGramaPequena = this.tilemapMapa.addTilesetImage('Plataforma_grama_pequena')
    this.tilesetPlataformaPedraPequena = this.tilemapMapa.addTilesetImage('Plataforma_pedra_pequena')

    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetblocoDeEstrada, this.tilesetblocoDeEstrada2, this.tilesetPlataformaDeEstradaFimEsqGrande, this.tilesetPlataformaDeEstradaMeio, this.tilesetPlataformaFloridaPequena, this.tilesetPlataformaGramaPequena, this.tilesetPlataformaPedraPequena])
    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetDeadCells])
  }

  update() {

  }
}
