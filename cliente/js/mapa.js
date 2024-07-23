export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
    this.dir_direita = true
    this.dir_esquerda = false
    this.entrar = undefined
    this.while = undefined
    this.contador = 0
    this.bounced = undefined
    this.blocked = true
  }

  preload () {
    this.load.audio('mapa', './assets/mapa.mp3')

    this.load.tilemapTiledJSON('mapateste', '/assets/mapa/mapteste.json')

    this.load.image('map', '/assets/mapa/map.png')

    this.load.spritesheet('cavaleiro-1', './assets/entities/kingone.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('cavaleiro-2', './assets/entities/kingtwo.png', { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet('jump', '/assets/ui/jump.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('baixo', '/assets/ui/baixo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('direita', '/assets/ui/direita.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('esquerda', '/assets/ui/esquerda.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('fogueira', '/assets/decoracao/bonfire.png', { frameWidth: 64, frameHeight: 64 })
  }

  create () {
    this.input.addPointer(3)
    // const math = require('mathjs');
    this.sound.add('mapa', { loop: true }).play()
    this.tilemapMapa = this.make.tilemap({ key: 'mapateste' })

    var jumpForce = -220
    var maxJumpTime = 150

    this.cameras.main.setZoom(1.7)

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

    if (globalThis.game.jogadores.primeiro === globalThis.game.socket.id) {
      globalThis.game.remoteConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.remoteConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

      globalThis.game.remoteConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.remoteConnection.ontrack = function ({ streams: [midia] }) {
        globalThis.game.audio.srcObject = midia
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.remoteConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.socket.on('offer', (description) => {
        globalThis.game.remoteConnection.setRemoteDescription(description)
          .then(() => globalThis.game.remoteConnection.createAnswer())
          .then((answer) => globalThis.game.remoteConnection.setLocalDescription(answer))
          .then(() => globalThis.game.socket.emit('answer', globalThis.game.sala, globalThis.game.remoteConnection.localDescription))
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.remoteConnection.addIceCandidate(candidate)
      })

      // Cria os sprites dos personagens local e remoto
      this.personagem = this.physics.add.sprite(10, -60, 'cavaleiro-1')
      this.personagemRemoto = this.add.sprite(10, -60, 'cavaleiro-2')
    } else if (globalThis.game.jogadores.segundo === globalThis.game.socket.id) {
      globalThis.game.localConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.localConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

      globalThis.game.localConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.localConnection.ontrack = function ({ streams: [stream] }) {
        globalThis.game.audio.srcObject = stream
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.localConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.localConnection.createOffer()
        .then((offer) => globalThis.game.localConnection.setLocalDescription(offer))
        .then(() => globalThis.game.socket.emit('offer', globalThis.game.sala, globalThis.game.localConnection.localDescription))

      globalThis.game.socket.on('answer', (description) => {
        globalThis.game.localConnection.setRemoteDescription(description)
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.localConnection.addIceCandidate(candidate)
      })

      // Cria os sprites dos personagens local e remoto
      this.personagem = this.physics.add.sprite(10, -60, 'cavaleiro-2')
      this.personagemRemoto = this.add.sprite(10, -60, 'cavaleiro-1')
    }

    this.anims.create({
      key: 'cavaleiro-1-idle-direita',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 22, end: 24 }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'fogueira',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 22, end: 24 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-idle-esquerda',
      frames: this.anims.generateFrameNumbers("fogueira", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-walkingLeft',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 18, end: 20 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-walkingRight',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 1, end: 3 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-2-jump-right',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 5, end: 5 }),
      frameRate: 1,
      repeat: -1
    })
    this.anims.create({
      key: 'cavaleiro-3-jump-right',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 6, end: 6 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-jump-start',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 17, end: 17 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-2-jump-left',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 16, end: 16 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-3-jump-left',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 15, end: 15 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-colide-right',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 8, end: 8 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'cavaleiro-1-colide-left',
      frames: this.anims.generateFrameNumbers(this.personagem.texture.key, { start: 13, end: 13 }),
      frameRate: 1,
      repeat: -1
    })

    this.esquerda = this.add.sprite(220, 550, 'esquerda', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        if (this.personagem.body.blocked.down && this.blocked === true) {
          this.dir_direita = false
          this.dir_esquerda = true
          this.personagem.anims.play('cavaleiro-1-walkingLeft')
          dir_lados = +1
          this.esquerda.setFrame(1)
          this.personagem.setVelocityX(-70)
        }
      }).on('pointerout', () => {
        if (this.personagem.body.blocked.down && this.blocked === true) {
          this.personagem.anims.play('cavaleiro-1-idle-esquerda')
          this.esquerda.setFrame(0)
          this.personagem.setVelocityX(0)
        }
      })

    this.direita = this.add.sprite(340, 550, 'direita', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        if (this.personagem.body.blocked.down && this.blocked === true) {
          this.personagem.anims.play('cavaleiro-1-walkingRight')
          dir_lados = -1
          this.dir_direita = true
          this.dir_esquerda = false
          this.direita.setFrame(1)
          this.personagem.setVelocityX(70)
        }
      }).on('pointerout', () => {
        if (this.personagem.body.blocked.down && this.blocked === true) {
          this.personagem.anims.play('cavaleiro-1-idle-direita')
          this.direita.setFrame(0)
          this.personagem.setVelocityX(0)
        }
      })

    this.jump = this.add.sprite(580, 550, 'jump', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        this.personagem.anims.play('cavaleiro-1-jump-start')
        this.jump.setFrame(0)
        jumpTimer += 1
        this.while = true
        this.personagem.setVelocityX(0)
        this.jump.setFrame(1)
      }).on('pointerup', () => {
        this.while = false
        if (jumpTimer > maxJumpTime) {
          jumpTimer = maxJumpTime
        }
        if (this.personagem.body.blocked.down) {
          jumping = true
          jumpTimer = 0
        } else {
          jumping = false
        }

        if (jumping && jumpTimer <= maxJumpTime) {
          jumping = false

          var jumpFactor = jumpTimer / maxJumpTime
          var currentJumpForceX = ((jumpForce - (jumpForce * jumpFactor)) * dir_lados)
          var currentJumpForceY = -305 * this.contador
          this.personagem.setVelocity(currentJumpForceX, currentJumpForceY)
          jumpTimer = 0
          if (this.dir_direita) {
            this.personagem.anims.play('cavaleiro-2-jump-right')
            this.jump.setFrame(0)
          } else if (this.dir_esquerda) {
            this.personagem.anims.play('cavaleiro-2-jump-left')
            this.jump.setFrame(0)
          }
          this.contador = 0
          this.blocked = true
        } else {
          jumping = false
        }
        this.jump.setFrame(0)
      })

    this.cameras.main.startFollow(this.personagem)
    this.layerBlocos.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagem, this.layerBlocos, this.bounce, null, this)

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }
    }
  }

  update () {
    try {
      // Envia os dados do jogo somente se houver conexão aberta
      if (globalThis.game.dadosJogo.readyState === 'open') {
        // Verifica que o personagem local existe
        if (this.personagem) {
          // Envia os dados do personagem local via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagem.x,
              y: this.personagem.y,
              frame: this.personagem.frame.name
            }
          }))
        }
      }
    } catch (error) {
      // Gera mensagem de erro na console
      console.error(error)
    }

    this.velocidadeX = this.personagem.body.velocity.x
    if (!this.personagem.body.blocked.down) {
      if (this.personagem.body.velocity.y > 0 && this.dir_direita && !this.bounced) {
        this.personagem.anims.play('cavaleiro-3-jump-right')
        this.jump.setFrame(0)
        this.entrar = true
      } else if (this.personagem.body.velocity.y > 0 && this.dir_esquerda && !this.bounced) {
        this.personagem.anims.play('cavaleiro-3-jump-left')
        this.jump.setFrame(0)
        this.entrar = true
      }

      if (this.bounced && this.dir_direita) {
        this.personagem.anims.play('cavaleiro-1-colide-right')
        this.entrar = true
      } else if (this.bounced && this.dir_esquerda) {
        this.personagem.anims.play('cavaleiro-1-colide-left')
        this.entrar = true
      }
    }
    if (this.personagem.body.blocked.down && this.entrar && this.dir_esquerda) {
      this.bounced = false
      this.personagem.anims.play('cavaleiro-1-idle-esquerda')
      this.esquerda.setFrame(0)
      this.entrar = false
      this.dir_esquerda = true
      this.personagem.setVelocity(0, 0)
    } else if (this.personagem.body.blocked.down && this.entrar && this.dir_direita) {
      this.bounced = false
      this.personagem.anims.play('cavaleiro-1-idle-direita')
      this.direita.setFrame(0)
      this.entrar = false
      this.dir_direita = true
      this.personagem.setVelocity(0, 0)
    }
    if (this.while) {
      this.blocked = false
      if (this.contador >= 2.2) {
        this.contador = 2.2
      }
      this.contador += 0.03
    }
    console.log(this.personagem.texture.key)
  }

  bounce (personagem, blocos) {
    if (this.personagem.body.blocked.right) {
      this.bounced = true
      this.personagem.body.velocity.x = -this.velocidadeX + 120
      this.personagem.anims.play('cavaleiro-1-colide-right')
      this.direita.setFrame(0)
    } else if (this.personagem.body.blocked.left) {
      this.bounced = true
      this.personagem.body.velocity.x = -this.velocidadeX
      this.personagem.anims.play('cavaleiro-1-colide-left')
      this.esquerda.setFrame(0)
    }
  }

  finalTriste () {
    // Encerra a cena atual e inicia a cena de final triste
    this.scene.stop('mapa')
    this.scene.start('finalTriste')
  }
}
