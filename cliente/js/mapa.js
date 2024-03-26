export default class mapa extends Phaser.Scene {
    constructor () {
      super('mapa')
    }
  
      preload() {
        this.load.tilemapTilledJSON('mapa', '/assets/mapa/mapa.json')

        this.load.image('bloco', '/assets/mapa/bloco.png')
      }
  
      create() {
        this.tilemapMapa = this.make.tilemap() [{
            key: 'mapa'
        }]
        this.tilesetBlocos = this.tilemapMapa.addTileset('bloco')

        this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetGrama])
        }
  
      update(){
      }
  }
  