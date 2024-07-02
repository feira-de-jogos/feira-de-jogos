
export default class mapa extends Phaser.Scene {
    constructor () {
      super('mapa')
    }

    
  
      preload() {
        this.load.tilemapTiledJSON('mapateste', '/assets/mapa/mapteste.json')

        this.load.image('map', '/assets/mapa/map.png')

        this.load.spritesheet('cavaleiro-1', './assets/entities/kingone.png', {frameWidth: 32, frameHeight: 32})

        this.load.spritesheet('jump', '/assets/ui/jump.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('baixo', '/assets/ui/baixo.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('direita', '/assets/ui/direita.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('esquerda', '/assets/ui/esquerda.png', {frameWidth: 64, frameHeight: 64})
      }
  
      create() {
        //const math = require('mathjs');
        // this.sound.add('mapa', {loop:true}).play()
        this.tilemapMapa = this.make.tilemap({  key: 'mapateste'})

        var jumpForce = -60
        let maxJumpTime = 50

        var onGround;

        var jumpTimer = 0
        let jumping = false
        var maxJumpHeight = 20
        var maxJumpDistance = 15

        

        var ponteiro = false
        var ponteiroup = false

        this.tilesetBlocos = this.tilemapMapa.addTilesetImage('map')

        this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetBlocos])
        this.layerBlocos = this.tilemapMapa.createLayer('blocos', [this.tilesetBlocos])
        this.layerDecoration = this.tilemapMapa.createLayer('decoracao-1', [this.tilesetBlocos])
        this.layerDecoration2 = this.tilemapMapa.createLayer('decoracao-2', [this.tilesetBlocos])

        
                
        this.personagem = this.physics.add.sprite(10, -20, 'cavaleiro-1')

        

        this.anims.create({ 
          key: 'cavaleiro-1-idle-direita',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 22, end: 24}),
          frameRate: 3,
          repeat: -1
        })

        this.anims.create({ 
          key: 'cavaleiro-1-idle-esquerda',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 41, end: 43}),
          frameRate: 3,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-walkingLeft',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 18, end: 20}),
          frameRate: 5,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-walkingRight',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 1, end: 3}),
          frameRate: 5,
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
          
          this.personagem.anims.play('cavaleiro-1-idle-esquerda')
          this.esquerda.setFrame(0)
          this.personagem.setVelocityX(0)
        })

        this.direita = this.add.sprite(180, 400, 'direita', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', ()=>{
          this.personagem.anims.play('cavaleiro-1-walkingRight')
          this.direita.setFrame(1)
          this.personagem.setVelocityX(50)
        }).on('pointerout', () => {
          this.personagem.anims.play('cavaleiro-1-idle-direita')
          this.direita.setFrame(0)
          this.personagem.setVelocityX(0)
        })

        this.jump = this.add.sprite(260, 400, 'jump', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown', ()=>{
          while (ponteiro){
            if(this.personagem.touching.down){
              jumping = true
              jumpTimer = 0

              this.personagem.setVelocityY(jumpForce)
            }
            if(jumping && jumpTimer < maxJumpTime && this.personagem.touching.down){
              let jumpFactor = jumpTimer / maxJumpTime
              let currentJumpForce = jumpForce - (jumpForce * jumpFactor)
              this.personagem.setVelocityY(currentJumpForce)
              jumpTimer+=this.time.deltaTime

            } else{
              jumping = false
            }

            if(this.personagem.y <= this.personagem.initialY - maxJumpHeight && onGround){
              this.personagem.setVelocityY(0)
            }
            
            //jumpveloY = jumpveloY + 2
            //if(ponteiro == false){
              //break
            //}
          }
          this.personagem.setVelocityY(jumpForce)
          
          this.jump.setFrame(1)
        }).on('pointerup', () => {
          this.jump.setFrame(0)
          //this.personagem.setVelocity(jumpveloX, jumpveloY)
        })

        this.cameras.main.startFollow(this.personagem)
        this.layerBlocos.setCollisionByProperty({ collides: true })
        this.physics.add.collider(this.personagem, this.layerBlocos)
      }
  
      update(){
        var onGround = this.personagem.body.touching.down
      }
  }
  