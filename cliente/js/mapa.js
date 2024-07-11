
export default class mapa extends Phaser.Scene {
    constructor () {
      super('mapa')
      this.dir_direita = true
      this.dir_esquerda = false
      this.entrar = undefined
      this.while = undefined
      this.contador = 0
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
        this.input.addPointer(3)
        //const math = require('mathjs');
        // this.sound.add('mapa', {loop:true}).play()
        this.tilemapMapa = this.make.tilemap({  key: 'mapateste'})

        var jumpForce = -120
        var maxJumpTime = 150

        var onGround;

        var jumpTimer = 0
        let jumping = false
        var maxJumpHeight = 20
        var maxJumpDistance = 15

        var deltaTime = Phaser.Time.Clock
        var dir_lados = -1
        

        var ponteiro = false
        var ponteiroup = false

        this.tilesetBlocos = this.tilemapMapa.addTilesetImage('map')

        this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetBlocos])
        this.layerBlocos = this.tilemapMapa.createLayer('blocos', [this.tilesetBlocos])
        this.layerDecoration = this.tilemapMapa.createLayer('decoracao-1', [this.tilesetBlocos])
        this.layerDecoration2 = this.tilemapMapa.createLayer('decoracao-2', [this.tilesetBlocos])

        
                
        this.personagem = this.physics.add.sprite(10, -60, 'cavaleiro-1')

        

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

        this.anims.create({
          key: 'cavaleiro-2-jump-right',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 5, end: 5}),
          frameRate: 1,
          repeat: -1
        })
        this.anims.create({
          key: 'cavaleiro-3-jump-right',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 6, end: 6}),
          frameRate: 1,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-1-jump-start',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 17, end: 17}),
          frameRate: 1,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-2-jump-left',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 16, end: 16}),
          frameRate: 1,
          repeat: -1
        })

        this.anims.create({
          key: 'cavaleiro-3-jump-left',
          frames: this.anims.generateFrameNumbers('cavaleiro-1', {start: 15, end: 15}),
          frameRate: 1,
          repeat: -1
        })


        this.esquerda = this.add.sprite(100, 400, 'esquerda', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', ()=>{
          if(this.personagem.body.blocked.down){
            this.dir_direita = false
            this.dir_esquerda = true
            this.personagem.anims.play('cavaleiro-1-walkingLeft')
            dir_lados = +1
            this.esquerda.setFrame(1)
            this.personagem.setVelocityX(-50)
          }
        }).on('pointerout', () => {
          if(this.personagem.body.blocked.down){
            this.personagem.anims.play('cavaleiro-1-idle-esquerda')
            this.esquerda.setFrame(0)
            this.personagem.setVelocityX(0)
          }
        })

        this.direita = this.add.sprite(180, 400, 'direita', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', ()=>{
          if(this.personagem.body.blocked.down){
            this.personagem.anims.play('cavaleiro-1-walkingRight')
            dir_lados = -1
            this.dir_direita = true
            this.dir_esquerda = false
            this.direita.setFrame(1)
            this.personagem.setVelocityX(50)
          }
        }).on('pointerout', () => {
          if(this.personagem.body.blocked.down){
            this.personagem.anims.play('cavaleiro-1-idle-direita')
            this.direita.setFrame(0)
            this.personagem.setVelocityX(0)
          }
        })

        this.jump = this.add.sprite(700, 400, 'jump', 0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown', ()=>{
          this.personagem.anims.play('cavaleiro-1-jump-start')
          this.jump.setFrame(0)
          jumpTimer+=1
          this.while = true
        this.jump.setFrame(1)
        }).on('pointerup', () => {
          this.while = false
            if(jumpTimer > maxJumpTime){
              jumpTimer = maxJumpTime
            }
            if(this.personagem.body.blocked.down){
              jumping = true
              jumpTimer = 0
            }else{
              jumping = false
            }
  
            if(jumping && jumpTimer <= maxJumpTime){
              jumping = false
              var jumpFactor = jumpTimer / maxJumpTime
              var currentJumpForceX = ((jumpForce - (jumpForce * jumpFactor)) * dir_lados) 
              var currentJumpForceY = -155 * this.contador
              this.personagem.setVelocity(currentJumpForceX, currentJumpForceY)
              jumpTimer = 0
              if(this.dir_direita){
                this.personagem.anims.play('cavaleiro-2-jump-right')
                this.jump.setFrame(0)
              } else if(this.dir_esquerda){
                this.personagem.anims.play('cavaleiro-2-jump-left')
                this.jump.setFrame(0) 
              }
              this.contador = 0
            } else{
              jumping = false
              
            }
          this.jump.setFrame(0)
          //this.personagem.setVelocity(jumpveloX, jumpveloY)
        })

        this.cameras.main.startFollow(this.personagem)
        this.layerBlocos.setCollisionByProperty({ collides: true })
        this.physics.add.collider(this.personagem, this.layerBlocos, this.bounce, null, this)
      }
  
      update(){
        if(!this.personagem.body.blocked.down){
          if(this.personagem.body.velocity.y > 0 && this.dir_direita){
            this.personagem.anims.play('cavaleiro-3-jump-right')
            this.jump.setFrame(0)
            this.entrar = true
            
          } else if(this.personagem.body.velocity.y > 0 && this.dir_esquerda){
            this.personagem.anims.play('cavaleiro-3-jump-left')
            this.jump.setFrame(0)
            this.entrar = true
          }
        }
        if(this.personagem.body.blocked.down && this.entrar && this.dir_esquerda){
          this.personagem.anims.play('cavaleiro-1-idle-esquerda')
          this.esquerda.setFrame(0)
          this.entrar = false
          this.dir_esquerda = true
          this.personagem.setVelocity(0, 0)
        }else if(this.personagem.body.blocked.down && this.entrar && this.dir_direita){
          this.personagem.anims.play('cavaleiro-1-idle-direita')
          this.direita.setFrame(0)
          this.entrar = false
          this.dir_direita = true
          this.personagem.setVelocity(0, 0)
        }
        if(this.while){
          if(this.contador >= 2){
            this.contador=2
          }
          this.contador+=0.04
        }
      }

      bounce (){
        if(this.personagem.body.collides){
          this.personagem.body.velocity= -this.personagem.body.velocity
        }
      }
  }
  