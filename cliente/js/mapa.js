export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapaindustrial.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tileindustrial64pxgeral.png')

    // Carregar spritesheets e animação do cartão
    this.load.spritesheet('alex', './assets/personagens/alex.png', { frameWidth: 36, frameHeight: 64 })
    this.load.spritesheet('stella', './assets/personagens/stella.png', { frameWidth: 36, frameHeight: 64 })
    this.load.spritesheet('blocoquebra', './assets/animacoes/card.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega as imagens dos botões
    this.load.spritesheet('cima', './assets/cima.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('baixo', './assets/baixo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('esquerda', './assets/esquerda.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('direita', './assets/direita.png', { frameWidth: 64, frameHeight: 64 })
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
      this.personagemLocal = this.physics.add.sprite(3500, 7200, 'alex')
      this.personagemRemoto = this.physics.add.sprite(3500, 7200, 'stella')
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
      this.personagemLocal = this.physics.add.sprite(3500, 7200, 'stella')
      this.personagemRemoto = this.physics.add.sprite(3500, 7200, 'alex')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerparedes.setCollisionByProperty({ collides: true })

    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerparedes)
    this.cameras.main.startFollow(this.personagemLocal)

    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Altera o frame do botão para pressionado
        this.cima.setFrame(1)

        // Faz o personagem andar para cima
        this.personagemLocal.setVelocityY(-250)

        // Anima o personagem andando para cima
        this.personagemLocal.anims.play('personagem-cima')
      })
      .on('pointerup', () => {
        // Altera o frame do botão para o estado original
        this.cima.setFrame(0)

        // Faz o personagem parar
        this.personagemLocal.setVelocityY(0)

        // Anima o personagem parado
        this.personagemLocal.anims.play('personagem-parado')
      })

    // Para o personagem

    this.anims.create({
      key: 'personagem-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 11,
        end: 18
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 3,
        end: 10
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 20,
        end: 21
      }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 1,
        end: 2
      }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 0,
        end: 0
      }),
      frameRate: 1
    })

    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Altera o frame do botão para pressionado
        this.baixo.setFrame(1)

        // Faz o personagem andar para baixo
        this.personagemLocal.setVelocityY(250)
        // Anima o personagem andando para baixo
        this.personagemLocal.anims.play('personagem-baixo')
      })
      .on('pointerup', () => {
        // Altera o frame do botão para o estado original
        this.baixo.setFrame(0)

        // Para o personagem velocidade
        this.personagemLocal.setVelocityY(0)

        // Anima o personagem parado
        this.personagemLocal.anims.play('personagem-parado')
      })

    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Altera o frame do botão para pressionado
        this.esquerda.setFrame(1)

        // Faz o personagem andar para a esquerda
        this.personagemLocal.setVelocityX(-250)

        // Muda a variável de controle do lado do personagem
        this.personagemLocal.anims.play('personagem-esquerda')
      })
      .on('pointerup', () => {
        // Altera o frame do botão para o estado original
        this.esquerda.setFrame(0)

        // Para o personagem
        this.personagemLocal.setVelocityX(0)

        // Anima o personagem parado
        this.personagemLocal.anims.play('personagem-parado')
      })

    this.direita = this.add.sprite(700, 350, 'direita', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Altera o frame do botão para pressionado
        this.direita.setFrame(1)

        // Faz o personagem andar para a direita
        this.personagemLocal.setVelocityX(250)

        // Muda a variável de controle do lado do personagem
        this.personagemLocal.anims.play('personagem-direita')
      })
      .on('pointerup', () => {
        // Altera o frame do botão para o estado original
        this.direita.setFrame(0)

        // Para o personagem
        this.personagemLocal.setVelocityX(0)

        // Anima o personagem parado
        this.personagemLocal.anims.play('personagem-parado')
      })


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
      }
    } catch (error) {
          // Gera mensagem de erro na console
          console.error(error)
    }
  }
}
