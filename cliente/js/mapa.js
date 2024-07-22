export default class tilemapMapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carrega os sons
    this.load.audio('mapa', './assets/mapa.mp3')

    // Carrega o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')

    // Carrega as imagens do mapa
    this.load.image('assets', './assets/mapa/assets.png')
    this.load.image('tiles', './assets/mapa/tiles.png')
    this.load.image('Restaurante', './assets/mapa/restaurante2.png')
    this.load.image('water_animation_demo', './assets/mapa/water_animation_demo.png')

    // Carrega as spritesheets dos personagens e artefatos
    this.load.spritesheet('salsicha-caramelo', './assets/salsicha-caramelo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('salsicha-marrom', './assets/salsicha-marrom.png', { frameWidth: 64, frameHeight: 64 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create () {
    // Adiciona um ponteiro de toque (padrão: 2)
    this.input.addPointer(3)

    // Configuração o objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetassets = this.tilemapMapa.addTilesetImage('assets')
    this.tilesettiles = this.tilemapMapa.addTilesetImage('tiles')
    this.tilesetrestaurante = this.tilemapMapa.addTilesetImage('Restaurante')
    this.tilesetagua = this.tilemapMapa.addTilesetImage('water_animation_demo')

    // Cria as camadas do mapa
    this.layerChao = this.tilemapMapa.createLayer('Chao', [this.tilesettiles])
    this.layerAnimacaoAgua = this.tilemapMapa.createLayer('AnimacaoAgua', [this.tilesetagua])
    this.layerSombra = this.tilemapMapa.createLayer('Sombra', [this.tilesettiles])
    this.layerMontanha = this.tilemapMapa.createLayer('Montanha', [this.tilesettiles])
    this.layerCaminhobarro = this.tilemapMapa.createLayer('Caminhobarro', [this.tilesettiles])
    this.layerCaminhoGrama = this.tilemapMapa.createLayer('CaminhoGrama', [this.tilesettiles])
    this.layerCaminhoMadeira = this.tilemapMapa.createLayer('Madeira', [this.tilesetassets])
    this.layerCaminhoObjetosCenario = this.tilemapMapa.createLayer('ObjetosCenario', [this.tilesetassets])
    this.layerCaminhoObjetoscenario2 = this.tilemapMapa.createLayer('Objetoscenario2', [this.tilesetassets])
    this.layerCaminhoPonteeagua = this.tilemapMapa.createLayer('Ponteeagua', [this.tilesetassets])
    this.layerCaminhoPontedois = this.tilemapMapa.createLayer('Pontedois', [this.tilesetassets])
    this.layerRestaurante = this.tilemapMapa.createLayer('Restaurante', [this.tilesetrestaurante])

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
      this.personagemLocal = this.physics.add.sprite(-1100, 500, 'salsicha-caramelo')
      this.personagemRemoto = this.physics.add.sprite(-1100, 5, 'salsicha-marrom')
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
      this.personagemLocal = this.physics.add.sprite(-1100, -5, 'salsicha-marrom')
      this.personagemRemoto = this.physics.add.sprite(-1000, 225, 'salsicha-caramelo')
    } else {
      // Gera mensagem de log para informar que o usuário está fora da partida
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')

      // Encerra a cena atual e inicia a cena de sala
      globalThis.game.scene.stop('mapa')
      globalThis.game.scene.start('sala')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerChao.setCollisionByProperty({ collides: true })

    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerChao)

    this.anims.create({
      key: 'salsicha-parado',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'salsicha-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 1, end: 3 }),
      frameRate: 7,
      repeat: -1
    })

    this.anims.create({
      key: 'salsicha-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 6, end: 8 }),
      frameRate: 7,
      repeat: -1
    })

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 120,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    }).on('update', this.handleJoystickMove, this)

    // Início do follow da câmera
    this.cameras.main.startFollow(this.personagemLocal)
    this.personagemLocal.lado = 'direita'

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
      console.error('Erro ao enviar os dados do jogo: ', error)
    }
  }

  handleJoystickMove () {
    const speed = 100 // Velocidade constante do personagem
    const threshold = 0.1 // Limite mínimo de força para considerar o movimento

    // Movimenta o personagem com base na direção do joystick
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > threshold) {
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      this.personagemLocal.setVelocity(velocityX, velocityY)

      // console.log('x: ', this.personagemLocal.x)
      // console.log('y: ', this.personagemLocal.y)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagemLocal.lado = 'direita'
          this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true)
        } else {
          this.personagemLocal.lado = 'esquerda'
          this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true)
        }
      } else {
        if (velocityY > 0) {
          this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true) // Mude isso se houver uma animação de movimento para baixo
        } else {
          this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true) // Mude isso se houver uma animação de movimento para cima
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      this.personagemLocal.anims.play('salsicha-parado', true)
    }
  }
}
