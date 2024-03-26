export default class abertura extends Phaser.Scene {
    constructor () {
      super('mapa')
    }
  
    preload () {
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')
    this.load.image('itens', './assets/mapa/itens.png')
  }
  
    create () {
        this.tilemapMapa = this.make.tilemap({ key: 'mapa'  })

        this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')

        this.layerItens = this.tilemapMapa.createLayer('itens', [this.tilesetItens])
        //É necessário deixar claro no código qual tileset foi utilizado em cada camada e referenciá-lo


    }
    
  
    update () {
    }
  }
  