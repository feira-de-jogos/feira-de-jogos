export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carrega os sons
    this.load.audio('trilha', './assets/trilha.mp3')
    this.load.audio('comendo', './assets/comendo.mp3')
    this.load.audio('correndo', './assets/correndo.mp3')
    this.load.audio('moeda', './assets/moeda.mp3')

    // Carrega o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')

    // Carrega as imagens do mapa
    this.load.image('grama', './assets/mapa/grama.png')
    this.load.image('cerca', './assets/mapa/cerca.png')
    this.load.image('arvore', './assets/mapa/arvore.png')
    this.load.image('casa', './assets/mapa/casa.png')
    this.load.image('vazio', './assets/vazio.png')

    // Carrega o personagem
    this.load.spritesheet('Boo', './assets/personagens/Boo.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('Missy', './assets/personagens/Missy.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o Vilão SUPREMO
    this.load.spritesheet('cachorro', './assets/personagens/cachorro.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega as imagens dos botões
    this.load.image('cima', './assets/botoes/cima.png')
    this.load.image('baixo', './assets/botoes/baixo.png')
    this.load.image('esquerda', './assets/botoes/esquerda.png')
    this.load.image('direita', './assets/botoes/direita.png')

    // Carrega os objetos.sprites
    this.load.spritesheet('cookie', './assets/cookies.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('moedinha', './assets/moedinha.png', { frameWidth: 32, frameHeight: 32 })
  }

  create () {
    // Adiciona um ponteiro de toque (padrão: 2)
    this.input.addPointer(3)

    // Adiciona o som
    this.trilha = this.sound.add('trilha', { loop: true }).play()
    this.comendo = this.sound.add('comendo')
    this.correndo = this.sound.add('correndo', { loop: true })
    this.moeda = this.sound.add('moeda')

    // Cria o objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa

    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetCerca = this.tilemapMapa.addTilesetImage('cerca')
    this.tilesetArvore = this.tilemapMapa.addTilesetImage('arvore')
    this.tilesetCasa = this.tilemapMapa.addTilesetImage('casa')

    // Cria as camadas do mapa
    this.layerGrama = this.tilemapMapa.createLayer('grama', [this.tilesetGrama])
    this.layerCerca = this.tilemapMapa.createLayer('cerca', [this.tilesetCerca])
    this.layerCasa = this.tilemapMapa.createLayer('casa', [this.tilesetCasa])
    this.layerArbusto = this.tilemapMapa.createLayer('arbusto', [this.tilesetArvore])

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
      this.personagemLocal = this.physics.add.sprite(400, 400, 'Missy')
      this.personagemRemoto = this.add.sprite(400, 432, 'Boo')
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
      this.personagemLocal = this.physics.add.sprite(432, 400, 'Boo')
      this.personagemRemoto = this.add.sprite(400, 400, 'Missy')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerCerca.setCollisionByProperty({ collides: true })
    this.layerArbusto.setCollisionByProperty({ collides: true })

    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerCerca, () => {
      this.correndo.stop()
      this.personagemLocal.anims.play('personagem-parado-baixo')
    }, null, this)
    this.physics.add.collider(this.personagemLocal, this.layerArbusto, () => {
      this.correndo.stop()
      this.personagemLocal.anims.play('personagem-parado-baixo')
    }, null, this)

    // Animação gatos
    this.anims.create({
      key: 'personagem-parado-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 11,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-caminhando-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 10,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 1,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-caminhando-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 6,
        end: 6
      }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-caminhando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 5,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 7,
        end: 7
      }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-caminhando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 8,
        end: 9
      }),
      frameRate: 10,
      repeat: -1
    })

    // botões
    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setAlpha(0.4)
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.correndo.play()
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.setVelocityY(-140)
        this.personagemLocal.anims.play('personagem-caminhando-cima')
      })

    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setAlpha(0.4)
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.correndo.play()
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.setVelocityY(140)
        this.personagemLocal.anims.play('personagem-caminhando-baixo')
      })

    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setAlpha(0.4)
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.correndo.play()
        this.personagemLocal.setVelocityY(0)
        this.personagemLocal.setVelocityX(-140)
        this.personagemLocal.anims.play('personagem-caminhando-esquerda')
      })

    this.direita = this.add.sprite(700, 350, 'direita', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setAlpha(0.4)
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.correndo.play()
        this.personagemLocal.setVelocityY(0)
        this.personagemLocal.setVelocityX(140)
        this.personagemLocal.anims.play('personagem-caminhando-direita')
      })

    this.vazioEsquerda = this.physics.add.sprite(0, 224, 'vazio')
    this.vazioEsquerda.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.vazioEsquerda, () => {
      this.personagemLocal.x = 750
      this.personagemLocal.setVelocityX(-140)
    }, null, this)

    this.vazioDireita = this.physics.add.sprite(800, 224, 'vazio')
    this.vazioDireita.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.vazioDireita, () => {
      this.personagemLocal.x = 50
      this.personagemLocal.setVelocityX(140)
    }, null, this)

    // Gera mensagem de log quando a conexão de dados é aberta
    globalThis.game.dadosJogo.onopen = () => {
      console.log('Conexão de dados aberta!')
    }
    // posições das moedinhas
    this.moedinha = [
      {
        x: 80,
        y: 80
      },
      {
        x: 368,
        y: 112
      },
      {
        x: 48,
        y: 368
      },
      {
        x: 304,
        y: 80
      },
      {
        x: 336,
        y: 80
      },
      {
        x: 48,
        y: 400
      },
      {
        x: 80,
        y: 400
      },
      {
        x: 112,
        y: 400
      },
      {
        x: 144,
        y: 400
      },
      {
        x: 176,
        y: 400
      },
      {
        x: 208,
        y: 400
      },
      {
        x: 240,
        y: 368
      },
      {
        x: 240,
        y: 336
      },
      {
        x: 272,
        y: 336
      },
      {
        x: 240,
        y: 304
      },
      {
        x: 272,
        y: 304
      },
      {
        x: 208,
        y: 304
      },
      {
        x: 176,
        y: 304
      },
      {
        x: 144,
        y: 304
      },
      {
        x: 176,
        y: 272
      },
      {
        x: 176,
        y: 176
      },
      {
        x: 144,
        y: 272
      },
      {
        x: 144,
        y: 336
      },
      {
        x: 80,
        y: 48
      },
      {
        x: 112,
        y: 48
      },
      {
        x: 180,
        y: 48
      },
      {
        x: 146,
        y: 48
      },
      {
        x: 146,
        y: 112
      },
      {
        x: 176,
        y: 336
      },
      {
        x: 180,
        y: 112
      },
      {
        x: 112,
        y: 112
      },
      {
        x: 80,
        y: 112
      },
      {
        x: 48,
        y: 112
      },
      {
        x: 48,
        y: 208
      },
      {
        x: 48,
        y: 240
      },
      {
        x: 80,
        y: 208
      },
      {
        x: 112,
        y: 208
      },
      {
        x: 144,
        y: 208
      },
      {
        x: 176,
        y: 208
      },
      {
        x: 176,
        y: 240
      },
      {
        x: 144,
        y: 240
      },
      {
        x: 112,
        y: 240
      },
      {
        x: 80,
        y: 240
      },
      {
        x: 176,
        y: 144
      },
      {
        x: 240,
        y: 176
      },
      {
        x: 240,
        y: 144
      },
      {
        x: 208,
        y: 112
      },
      {
        x: 208,
        y: 144
      },
      {
        x: 272,
        y: 208
      },
      {
        x: 304,
        y: 208
      },
      {
        x: 208,
        y: 240
      },
      {
        x: 272,
        y: 240
      },
      {
        x: 272,
        y: 176
      },
      {
        x: 304,
        y: 176
      },
      {
        x: 304,
        y: 144
      },
      {
        x: 304,
        y: 112
      }, {
        x: 240,
        y: 112
      },
      {
        x: 336,
        y: 112
      },
      {
        x: 336,
        y: 48
      },
      {
        x: 304,
        y: 48
      },
      {
        x: 272,
        y: 48
      },
      {
        x: 400,
        y: 112
      },
      {
        x: 432,
        y: 112
      },
      {
        x: 464,
        y: 112
      },
      {
        x: 496,
        y: 112
      },
      {
        x: 464,
        y: 80
      },
      {
        x: 496,
        y: 80
      },
      {
        x: 496,
        y: 48
      },
      {
        x: 464,
        y: 48
      },
      {
        x: 432,
        y: 48
      },
      {
        x: 400,
        y: 48
      },
      {
        x: 368,
        y: 48
      },
      {
        x: 528,
        y: 48
      },
      {
        x: 560,
        y: 112
      },
      {
        x: 560,
        y: 144
      },
      {
        x: 560,
        y: 176
      },
      {
        x: 560,
        y: 240
      },
      {
        x: 528,
        y: 176
      },
      {
        x: 496,
        y: 176
      },
      {
        x: 496,
        y: 144
      },
      {
        x: 496,
        y: 208
      },
      {
        x: 496,
        y: 240
      },
      {
        x: 496,
        y: 272
      },
      {
        x: 496,
        y: 304
      },
      {
        x: 528,
        y: 240
      },
      {
        x: 528,
        y: 208
      },
      {
        x: 464,
        y: 240
      },
      {
        x: 432,
        y: 240
      },
      {
        x: 400,
        y: 240
      },
      {
        x: 368,
        y: 240
      },
      {
        x: 336,
        y: 240
      },
      {
        x: 304,
        y: 240
      },
      {
        x: 304,
        y: 272
      },
      {
        x: 304,
        y: 304
      },
      {
        x: 336,
        y: 272
      },
      {
        x: 368,
        y: 272
      },
      {
        x: 400,
        y: 272
      },
      {
        x: 432,
        y: 272
      },
      {
        x: 464,
        y: 272
      },
      {
        x: 368,
        y: 304
      },
      {
        x: 400,
        y: 304
      },
      {
        x: 432,
        y: 304
      },
      {
        x: 368,
        y: 336
      },
      {
        x: 400,
        y: 336
      },
      {
        x: 368,
        y: 368
      },
      {
        x: 400,
        y: 368
      },
      {
        x: 368,
        y: 400
      },
      {
        x: 400,
        y: 400
      },
      {
        x: 336,
        y: 400
      },
      {
        x: 432,
        y: 400
      },
      {
        x: 496,
        y: 400
      },
      {
        x: 464,
        y: 400
      },
      {
        x: 528,
        y: 400
      },
      {
        x: 560,
        y: 400
      },
      {
        x: 560,
        y: 368
      },
      {
        x: 688,
        y: 400
      },
      {
        x: 720,
        y: 400
      },
      {
        x: 752,
        y: 400
      },
      {
        x: 752,
        y: 368
      },
      {
        x: 752,
        y: 336
      },
      {
        x: 720,
        y: 336
      },
      {
        x: 688,
        y: 336
      },
      {
        x: 656,
        y: 336
      },
      {
        x: 624,
        y: 336
      },
      {
        x: 560,
        y: 336
      },
      {
        x: 528,
        y: 336
      },
      {
        x: 528,
        y: 304
      },
      {
        x: 560,
        y: 304
      },
      {
        x: 592,
        y: 304
      },
      {
        x: 624,
        y: 304
      },
      {
        x: 656,
        y: 304
      },
      {
        x: 656,
        y: 272
      },
      {
        x: 656,
        y: 240
      },
      {
        x: 624,
        y: 240
      },
      {
        x: 688,
        y: 240
      },
      {
        x: 720,
        y: 240
      },
      {
        x: 752,
        y: 240
      },
      {
        x: 752,
        y: 208
      },
      {
        x: 720,
        y: 208
      },
      {
        x: 688,
        y: 208
      },
      {
        x: 624,
        y: 208
      },
      {
        x: 656,
        y: 208
      },
      {
        x: 624,
        y: 176
      },
      {
        x: 624,
        y: 144
      },
      {
        x: 592,
        y: 144
      },
      {
        x: 624,
        y: 112
      },
      {
        x: 592,
        y: 112
      },
      {
        x: 656,
        y: 112
      },
      {
        x: 688,
        y: 112
      },
      {
        x: 624,
        y: 80
      },
      {
        x: 624,
        y: 48
      },
      {
        x: 720,
        y: 112
      },
      {
        x: 752,
        y: 112
      },
      {
        x: 752,
        y: 80
      },
      {
        x: 720,
        y: 48
      },
      {
        x: 688,
        y: 48
      },
      {
        x: 656,
        y: 48
      },
      {
        x: 80,
        y: 336
      },
      {
        x: 112,
        y: 336
      }
    ]
    // Animaçao da moedinha
    this.anims.create({
      key: 'moedinha',
      frames: this.anims.generateFrameNumbers('moedinha', {
        start: 1,
        end: 7
      }),
      frameRate: 5,
      repeat: -1
    })

    this.moedinha.forEach((moedinha) => {
      moedinha.objeto = this.physics.add.sprite(moedinha.x, moedinha.y, 'moedinha')
      moedinha.objeto.anims.play('moedinha')
      moedinha.colisao = this.physics.add.overlap(this.personagemLocal, moedinha.objeto, () => {
        this.moeda.play()
        moedinha.objeto.disableBody(true, true)
      }, null, this)
    })

    // posições dos cookies
    this.cookies = [
      {
        x: 180,
        y: 80
      },
      {
        x: 48,
        y: 80
      },
      {
        x: 720,
        y: 80
      },
      {
        x: 240,
        y: 48
      },
      {
        x: 560,
        y: 48
      },
      {
        x: 585,
        y: 240
      },
      {
        x: 496,
        y: 336
      },
      {
        x: 656,
        y: 400
      },
      {
        x: 240,
        y: 240
      },
      {
        x: 304,
        y: 336
      },
      {
        x: 240,
        y: 400
      },
      {
        x: 48,
        y: 336
      }
    ]
    // Animaçao do cookie
    this.anims.create({
      key: 'cookie-girando',
      frames: this.anims.generateFrameNumbers('cookie', {
        start: 0,
        end: 6
      }),
      frameRate: 5,
      repeat: -1
    })

    this.cookies.forEach((cookie) => {
      cookie.objeto = this.physics.add.sprite(cookie.x, cookie.y, 'cookie')
      cookie.objeto.anims.play('cookie-girando')
      cookie.colisao = this.physics.add.overlap(this.personagemLocal, cookie.objeto, () => {
        this.comendo.play()
        cookie.objeto.disableBody(true, true)
      }, null, this)
    })

    this.placar = this.add.text(50, 50, '0 / 0').setScrollFactor(0)

    // Processa as mensagens recebidas via DataChannel
    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }

      if (dados.cookies) {
        this.cookies.forEach((cookie, i) => {
          if (!dados.cookies[i].visible) {
            cookie.objeto.disableBody(true, true)
          }
        })
      }

      if (dados.moedinha) {
        this.moedinha.forEach((moedinha, i) => {
          if (!dados.moedinha[i].visible) {
            moedinha.objeto.disableBody(true, true)
          }
        })
      }
    }
    // Carregar o cachorro
    this.cachorro = this.physics.add.sprite(432, 176, 'cachorro')

    this.physics.add.overlap(this.cachorro, this.personagemRemoto, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 368
      this.personagemLocal.y = 176
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    }, null, this)
    this.physics.add.overlap(this.cachorro, this.personagemLocal, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 368
      this.personagemLocal.y = 176
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    }, null, this)

    this.physics.add.collider(this.cachorro, this.layerCerca)
    this.physics.add.collider(this.cachorro, this.layerArbusto)
    // Animação cachorro

    this.anims.create({
      key: 'cachorro-parado-esquerda',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 6,
        end: 6
      }),
      frameRate: 1
    })

    this.anims.create({
      key: 'personagem-caminhando-esquerda',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 4,
        end: 5
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 9,
        end: 9
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-caminhando-direita',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 7,
        end: 8
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 10,
        end: 11
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-caminhando-cima',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 12,
        end: 13
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-baixo',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 3,
        end: 3
      }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-caminhando-baixo',
      frames: this.anims.generateFrameNumbers('cachorro', {
        start: 1,
        end: 2
      }),
      frameRate: 5,
      repeat: -1
    })
  }

  update () {
    // cachorro segue personagem mais próximo
    const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
      this.personagemLocal.x,
      this.personagemLocal.y,
      this.cachorro.x,
      this.cachorro.y
    )

    const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
      this.personagemRemoto.x,
      this.personagemRemoto.y,
      this.cachorro.x,
      this.cachorro.y
    )

    // Por padrão, o primeiro jogador é o alvo
    let alvo = this.personagemLocal
    if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
      // Jogador 2 é perseguido pelo cachorro
      alvo = this.personagemRemoto
    }

    // Sentido no eixo X
    const diffX = alvo.x - this.cachorro.x
    if (diffX >= 10) {
      this.cachorro.setVelocityX(70)
    } else if (diffX <= 10) {
      this.cachorro.setVelocityX(-70)
    }

    // Sentido no eixo Y
    const diffY = alvo.y - this.cachorro.y
    if (diffY >= 10) {
      this.cachorro.setVelocityY(70)
    } else if (diffY <= 10) {
      this.cachorro.setVelocityY(-70)
    }

    // Animação
    try {
      if (diffX > 0) {
        this.cachorro.anims.play('cachorro-caminhando-direita', true)
      } else if (diffX < 0) {
        this.cachorro.anims.play('cachorro-caminhando-esquerda', true)
      } else if (diffY > 0) {
        this.cachorro.anims.play('cachorro-caminhando-baixo', true)
      } else if (diffY < 0) {
        this.cachorro.anims.play('cachorro-caminhando-cima', true)
      } else {
        this.cachorro.anims.play('cachorro-parado-esquerda')
      }

      // Envia os dados do jogo somente se houver conexão aberta
      if (globalThis.game.dadosJogo.readyState === 'open') {
        // Verifica que o personagem local existe
        if (this.personagemLocal) {
          // Envia os dados do personagem local via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagemLocal.x,
              y: this.personagemLocal.y,
              frame: this.personagemLocal.frame.name
            }
          }))
        }

        if (this.cookies) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            cookies: this.cookies.map(cookie => (cookie => ({
              visible: cookie.objeto.visible
            }))(cookie))
          }))
        }

        if (this.moedinha) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            moedinha: this.moedinha.map(moedinha => (moedinha => ({
              visible: moedinha.objeto.visible
            }))(moedinha))
          }))
        }
      }
    } catch (error) {
      // Gera mensagem de erro na console
      console.error(error)
    }

    const moedinhaColetada = this.moedinha.filter(moedinha => !moedinha.objeto.active).length
    if (moedinhaColetada >= this.moedinha.length) {
      this.scene.stop('mapa')
      this.scene.start('finalFeliz')
    }

    const cookiesColetados = this.cookies.filter(cookie => !cookie.objeto.active).length
    if (cookiesColetados >= this.cookies.length) {
      this.scene.stop('mapa')
      this.scene.start('finalFeliz')
    }

    this.placar.setText(`${cookiesColetados} / ${moedinhaColetada}`)
  }
}
