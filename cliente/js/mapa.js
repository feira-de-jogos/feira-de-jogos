export default class mapa extends Phaser.Scene {
    constructor () {
      super('mapa')
    }
  
      preload() {
        //this.load.tilemapTilledJSON('mapa', '/assets/mapa/mapa.json')

        //this.load.image('jumpKing', '/assets/mapa/jumpKing.png')

        this.load.spritesheet('cavaleiro-1', './assets/entities/jumpKing.png', {frameWidth: 32, frameHeight: 32})

        this.load.spritesheet('cima', '/assets/ui/cima.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('baixo', '/assets/ui/baixo.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('direita', '/assets/ui/direita.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('esquerda', '/assets/ui/esquerda.png', {frameWidth: 64, frameHeight: 64})
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
          frameRate: 8,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-walkingRight',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 1, end: 3}),
          frameRate: 8,
          repeat: -1
        })


        this.esquerda = this.add.sprite(100, 400, 'esquerda', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', ()=>{
          this.personagem.anims.play('cavaleiro-1-walkingLeft')
          this.esquerda.setFrame(1)
          this.personagem.setVelocityX(-50)
        }).on('pointerout', () => {
          this.esquerda.setFrame(0)
          this.personagem.setVelocityX(0)
        })

        this.direita = this.add.sprite(180, 400, 'direita', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', ()=>{
          this.direita.setFrame(1)
          this.personagem.setVelocityX(50)
        }).on('pointerout', () => {
          this.direita.setFrame(0)
          this.personagem.setVelocityX(0)
        })

      }
  
      update(){
      }
  }
  