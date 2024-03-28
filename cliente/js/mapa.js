export default class mapa extends Phaser.Scene {
    constructor () {
      super('mapa')
    }
  
      preload() {
        //this.load.tilemapTilledJSON('mapa', '/assets/mapa/mapa.json')

        //this.load.image('jumpKing', '/assets/mapa/jumpKing.png')

        this.load.spritesheet('cavaleiro-1', './assets/entities/jumpKing.png', {frameWidth: 32, frameHeight: 32})
      }
  
      create() {
        //this.sound.add('mapa', {loop:true}).play()
        //this.tilemapMapa = this.make.tilemap() [{
        //    key: 'mapa'
        //}]

        //this.tilesetBlocos = this.tilemapMapa.addTileset('jumpKing')

        //this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetBlocos])
                
        this.personagem = this.physics.add.sprite(400, 255, 'cavaleiro-1')

        this.anims.create({ 
          key: 'cavaleiro-1-idle',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 0, end: 1}),
          frameRate: 1,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-walkingLeft',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 0, end: 1}),
          frameRate: 1,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-walkingRight',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 1, end: 3}),
          frameRate: 8,
          repeat: -1
        })

        this.personagem.setInteractive().on('pointerdown', () => {
          this.personagem.anims.play('cavaleiro-1-walkingRight')
          this.personagem.setVelocityX(25)
        })

      }
  
      update(){
      }
  }
  