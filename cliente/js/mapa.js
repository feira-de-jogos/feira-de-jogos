// import Phaser from 'phaser'
export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // lembrando que temos que carregar o som como primeiro de tudo, até acima do mapa, apartir do mesmo comando:

    this.load.audio('somarenaboss', './assets/sons/somarenaboss.mp3')
    this.load.audio('somcristal', './assets/sons/somcristal.mp3')
    this.load.audio('somderrota', './assets/sons/somderrota.mp3')
    this.load.audio('somgrama', './assets/sons/somgrama.mp3')
    this.load.audio('somhitben', './assets/sons/somhitben.mp3')
    this.load.audio('somhitleo', './assets/sons/somhitleo.mp3')
    this.load.audio('somtesouro', './assets/sons/somtesouro.mp3')
    this.load.audio('somvitoria', './assets/sons/somvitoria.mp3')
    this.load.audio('somfundo', './assets/sons/somfundo.mp3')
    this.load.audio('somporta', './assets/sons/somhitben.mp3')

    // Sprites load

    this.load.tilemapTiledJSON('mapa', '/assets/mapa/Mapa.json')

    this.load.image('BlocosCenarioVerde', './assets/mapa/BlocosCenarioVerde.png')
    this.load.image('BlocosCenarioAmarelo', './assets/mapa/BlocosCenarioAmarelo.png')
    this.load.image('BlocosCenarioVermelho', './assets/mapa/BlocosCenarioVermelho.png')
    this.load.image('BlocosCenarioAzul', './assets/mapa/BlocosCenarioAzul.png')
    this.load.image('BlocosCenarioRoxo', './assets/mapa/BlocosCenarioRoxo.png')
    this.load.image('BlocosMorte', './assets/mapa/BlocosMorte.png')
    this.load.image('BlocosTeto', './assets/mapa/BlocosTeto.png')
    this.load.image('BlocosBordas', './assets/mapa/BlocosBordas.png')
    this.load.image('Gramas', './assets/mapa/Gramas.png')
    this.load.image('GramasAmarela', './assets/mapa/GramasAmarela.png')
    this.load.image('GramasAzul', './assets/mapa/GramasAzul.png')
    this.load.image('GramasVermelho', './assets/mapa/GramasVermelho.png')
    this.load.image('GramasRoxo', './assets/mapa/GramasRoxo.png')
    this.load.image('Pedrinhas', './assets/mapa/Pedrinhas.png')
    this.load.image('FundoCavernaAzul', './assets/mapa/FundoCavernaAzul.png')
    this.load.image('FundoCavernaRoxa', './assets/mapa/FundoCavernaRoxa.png')
    this.load.image('FundoCavernaVerde', './assets/mapa/FundoCavernaVerde.png')
    this.load.image('FundoCavernaVermelho', './assets/mapa/FundoCavernaVermelho.png')
    this.load.image('FundoCavernaAmarela', './assets/mapa/FundoCavernaAmarela.png')
    this.load.image('Vazio', './assets/mapa/Vazio.png')
    this.load.image('pedra', './assets/mapa/pedra.png')
    this.load.image('inicio', './assets/mapa/inicio.png')
    this.load.image('arenaboss', './assets/mapa/arenaboss.png')

    // spritesheets

    // Sprites Personagens e Monstros:
    this.load.spritesheet('LeoVen', './assets/personagens/LeoVen.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('BenVen', './assets/personagens/BenVen.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('monstro', './assets/personagens/monstro.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('ogrogelo', './assets/personagens/ogrogelo.png', { frameWidth: 75, frameHeight: 105 })
    this.load.spritesheet('ogroamarelo', './assets/personagens/ogroamarelo.png', { frameWidth: 75, frameHeight: 105 })
    this.load.spritesheet('ogrofogo', './assets/personagens/ogrofogo.png', { frameWidth: 75, frameHeight: 105 })
    this.load.spritesheet('ogroroxo', './assets/personagens/ogroroxo.png', { frameWidth: 75, frameHeight: 105 })
    this.load.spritesheet('dragaozinhofogo', './assets/personagens/dragaozinhofogo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('dragaozinhogelo', './assets/personagens/dragaozinhogelo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('dragaozinhoroxo', './assets/personagens/dragaozinhoroxo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('dragaozinhoverde', './assets/personagens/dragaozinhoverde.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('dragaozinho', './assets/personagens/dragaozinho.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('tutorial', './assets/tutorial.png', { frameWidth: 588, frameHeight: 195 })
    this.load.spritesheet('bau', './assets/spritesmapa/bau.png', { frameWidth: 110, frameHeight: 100 })

    // Sprites Altares e objetos:
    this.load.spritesheet('altarcristalamarelo', './assets/spritesmapa/altarcristalamarelo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('altarcristalfogo', './assets/spritesmapa/altarcristalfogo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('altarcristalgelo', './assets/spritesmapa/altarcristalgelo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('altarcristalroxo', './assets/spritesmapa/altarcristalroxo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('PortaBoss', './assets/spritesmapa/PortaBoss.png', { frameWidth: 96, frameHeight: 96 })
    this.load.spritesheet('cristalamarelo', './assets/spritesmapa/cristalamarelo.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('cristalvermelho', './assets/spritesmapa/cristalvermelho.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('cristalazul', './assets/spritesmapa/cristalazul.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('cristalroxo', './assets/spritesmapa/cristalroxo.png', { frameWidth: 16, frameHeight: 16 })

    // Sprites Botoes
    this.load.spritesheet('cima', './assets/Controles/SetaCima.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('esquerda', './assets/Controles/SetaEsq.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('direita', './assets/Controles/SetaDir.png', { frameWidth: 128, frameHeight: 128 })
  }

  create () {
    // adiciona o ponteiro de toque:
    this.input.addPointer(3)

    // Som do mapa
    this.sound.add('somfundo', { loop: true }).play()
    this.somhitben = this.sound.add('somhitben')
    this.hitleo = this.sound.add('somhitleo')
    this.somtesouro = this.sound.add('somtesouro')
    this.somarenaboss = this.sound.add('somarenaboss')
    this.somcristal = this.sound.add('somcristal')
    this.somgrama = this.sound.add('somgrama')
    this.somporta = this.sound.add('somporta')

    // cria o objeto tilemap (mapa)
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Tilesets do mapa
    this.tilesetBlocosBordas = this.tilemapMapa.addTilesetImage('BlocosBordas')
    this.tilesetBlocosCenarioVerde = this.tilemapMapa.addTilesetImage('BlocosCenarioVerde')
    this.tilesetBlocosCenarioAmarelo = this.tilemapMapa.addTilesetImage('BlocosCenarioAmarelo')
    this.tilesetBlocosCenarioVermelho = this.tilemapMapa.addTilesetImage('BlocosCenarioVermelho')
    this.tilesetBlocosCenarioAzul = this.tilemapMapa.addTilesetImage('BlocosCenarioAzul')
    this.tilesetBlocosCenarioRoxo = this.tilemapMapa.addTilesetImage('BlocosCenarioRoxo')
    this.tilesetBlocosMorte = this.tilemapMapa.addTilesetImage('BlocosMorte')
    this.tilesetBlocosTeto = this.tilemapMapa.addTilesetImage('BlocosTeto')
    this.tilesetFundoCavernaAzul = this.tilemapMapa.addTilesetImage('FundoCavernaAzul')
    this.tilesetFundoCavernaRoxa = this.tilemapMapa.addTilesetImage('FundoCavernaRoxa')
    this.tilesetFundoCavernaVerde = this.tilemapMapa.addTilesetImage('FundoCavernaVerde')
    this.tilesetFundoCavernaVermelho = this.tilemapMapa.addTilesetImage('FundoCavernaVermelho')
    this.tilesetFundoCavernaAmarela = this.tilemapMapa.addTilesetImage('FundoCavernaAmarela')
    this.tilesetGramas = this.tilemapMapa.addTilesetImage('Gramas')
    this.tilesetGramasAmarela = this.tilemapMapa.addTilesetImage('GramasAmarela')
    this.tilesetGramasAzul = this.tilemapMapa.addTilesetImage('GramasAzul')
    this.tilesetGramasVermelho = this.tilemapMapa.addTilesetImage('GramasVermelho')
    this.tilesetGramasRoxo = this.tilemapMapa.addTilesetImage('GramasRoxo')
    this.tilesetPedrinhas = this.tilemapMapa.addTilesetImage('Pedrinhas')
    this.tilesetpedra = this.tilemapMapa.addTilesetImage('pedra')
    this.tilesetinicio = this.tilemapMapa.addTilesetImage('inicio')
    this.tilesetarenaboss = this.tilemapMapa.addTilesetImage('arenaboss')

    // Layers do mapa
    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetFundoCavernaAzul, this.tilesetFundoCavernaRoxa, this.tilesetFundoCavernaVerde, this.tilesetFundoCavernaVermelho, this.tilesetFundoCavernaAmarela, this.tilesetBlocosBordas, this.tilesetinicio, this.tilesetarenaboss])
    this.layerChao = this.tilemapMapa.createLayer('Chao', [this.tilesetBlocosCenarioVerde, this.tilesetBlocosCenarioAmarelo, this.tilesetBlocosCenarioVermelho, this.tilesetBlocosCenarioAzul, this.tilesetBlocosCenarioRoxo, this.tilesetpedra, this.tilesetBlocosTeto])
    this.layerParedes = this.tilemapMapa.createLayer('Paredes', [this.tilesetBlocosTeto, this.tilesetpedra])
    this.layerObstaculos = this.tilemapMapa.createLayer('Obstaculos', [this.tilesetBlocosMorte])

    // Criação de estruturas
    // bau:
    this.bau = this.physics.add.sprite(1208, 3730, 'bau')
    this.bau.body.setAllowGravity(false)
    this.bau.body.setImmovable(true)

    // tutorial
    this.tutorial = this.add.sprite(6010, 1200, 'tutorial')
    this.tutorial.setScale(0.8)

    // Porta do Boss:
    this.PortaBoss = this.physics.add.sprite(3606, 2595, 'PortaBoss')
    this.PortaBoss.body.setAllowGravity(false)
    this.PortaBoss.setScale(2)

    // ALTARES:

    // Altar Cristal Amarelo:
    this.altarcristalamarelo = this.physics.add.sprite(7113, 2600, 'altarcristalamarelo')
    this.altarcristalamarelo.body.setAllowGravity(false)

    // Altar Cristal Fogo:
    this.altarcristalfogo = this.physics.add.sprite(3030, 4200, 'altarcristalfogo')
    this.altarcristalfogo.body.setAllowGravity(false)

    // Altar Cristal Gelo:
    this.altarcristalgelo = this.physics.add.sprite(3798, 613, 'altarcristalgelo')
    this.altarcristalgelo.body.setAllowGravity(false)

    // Altar Cristal Roxo:
    this.altarcristalroxo = this.physics.add.sprite(1623, 1570, 'altarcristalroxo')
    this.altarcristalroxo.body.setAllowGravity(false)

    // Players:
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
      this.personagemLocal = this.physics.add.sprite(5441, 1060, 'LeoVen')
      this.personagemRemoto = this.add.sprite(5480, 1060, 'BenVen')
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
      this.personagemLocal = this.physics.add.sprite(5480, 1060, 'BenVen')
      this.personagemRemoto = this.add.sprite(5441, 1060, 'LeoVen')
    }

    this.layerDetalhes = this.tilemapMapa.createLayer('Detalhes', [this.tilesetPedrinhas, this.tilesetGramas, this.tilesetGramasAmarela, this.tilesetGramasAzul, this.tilesetGramasVermelho, this.tilesetGramasRoxo])

    // Animações dos personagens:
    // parado direita
    this.anims.create({
      key: 'parado_direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 5, end: 9 }),
      frameRate: 2,
      repeat: -1
    })

    // parado esquerda
    this.anims.create({
      key: 'parado_esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 4 }),
      frameRate: 2,
      repeat: -1
    })

    // andando para direita
    this.anims.create({
      key: 'andando_direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 20, end: 27 }),
      frameRate: 8,
      repeat: -1
    })

    // andando para esquerda
    this.anims.create({
      key: 'andando_esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 11, end: 18 }),
      frameRate: 8,
      repeat: -1
    })

    // Pulando para direita:
    this.anims.create({
      key: 'pulando_direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 34, end: 37 }),
      frameRate: 4
    })

    // pulando para esquerda
    this.anims.create({
      key: 'pulando_esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 28, end: 32 }),
      frameRate: 8
    })

    // ANIMAÇÃO INIMIGOS:

    // Monstro:
    this.anims.create({
      key: 'monstro_andando_direita',
      frames: this.anims.generateFrameNumbers('monstro', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'monstro_andando_esquerda',
      frames: this.anims.generateFrameNumbers('monstro', { start: 9, end: 11 }),
      frameRate: 5,
      repeat: -1
    })

    // DRAGOES:
    // dragaozinho:
    this.anims.create({
      key: 'dragaozinho_voando_direita',
      frames: this.anims.generateFrameNumbers('dragaozinho', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'dragaozinho_voando_esquerda',
      frames: this.anims.generateFrameNumbers('dragaozinho', { start: 8, end: 11 }),
      frameRate: 5,
      repeat: -1
    })

    // dragaozinhofogo:
    this.anims.create({
      key: 'dragaozinhofogo_voando_direita',
      frames: this.anims.generateFrameNumbers('dragaozinhofogo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'dragaozinhofogo_voando_esquerda',
      frames: this.anims.generateFrameNumbers('dragaozinhofogo', { start: 8, end: 11 }),
      frameRate: 5,
      repeat: -1
    })

    // dragaozinhogelo:
    this.anims.create({
      key: 'dragaozinhogelo_voando_direita',
      frames: this.anims.generateFrameNumbers('dragaozinhogelo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'dragaozinhogelo_voando_esquerda',
      frames: this.anims.generateFrameNumbers('dragaozinhogelo', { start: 8, end: 11 }),
      frameRate: 5,
      repeat: -1
    })

    // dragaozinhoroxo:
    this.anims.create({
      key: 'dragaozinhoroxo_voando_direita',
      frames: this.anims.generateFrameNumbers('dragaozinhoroxo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'dragaozinhoroxo_voando_esquerda',
      frames: this.anims.generateFrameNumbers('dragaozinhoroxo', { start: 8, end: 11 }),
      frameRate: 5,
      repeat: -1
    })

    // dragaozinhoverde:
    this.anims.create({
      key: 'dragaozinhoverde_voando_direita',
      frames: this.anims.generateFrameNumbers('dragaozinhoverde', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'dragaozinhoverde_voando_esquerda',
      frames: this.anims.generateFrameNumbers('dragaozinhoverde', { start: 8, end: 11 }),
      frameRate: 5,
      repeat: -1
    })
    // OGROS:
    // ogrogelo:
    this.anims.create({
      key: 'ogrogelo_andando_direita',
      frames: this.anims.generateFrameNumbers('ogrogelo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'ogrogelo_andando_esquerda',
      frames: this.anims.generateFrameNumbers('ogrogelo', { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1
    })
    // ogroamarelo:
    this.anims.create({
      key: 'ogroamarelo_andando_direita',
      frames: this.anims.generateFrameNumbers('ogroamarelo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'ogroamarelo_andando_esquerda',
      frames: this.anims.generateFrameNumbers('ogroamarelo', { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1
    })

    // ogrofogo:
    this.anims.create({
      key: 'ogrofogo_andando_direita',
      frames: this.anims.generateFrameNumbers('ogrofogo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'ogrofogo_andando_esquerda',
      frames: this.anims.generateFrameNumbers('ogrofogo', { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1
    })

    // ogroroxo:
    this.anims.create({
      key: 'ogroroxo_andando_direita',
      frames: this.anims.generateFrameNumbers('ogroroxo', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'ogroroxo_andando_esquerda',
      frames: this.anims.generateFrameNumbers('ogroroxo', { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1
    })

    // ESTRUTURA ANIMAÇÕES:

    // porta do boss
    this.anims.create({
      key: 'PortaBoss',
      frames: this.anims.generateFrameNumbers('PortaBoss', { start: 0, end: 8 }),
      frameRate: 3
    })

    // Controles:
    // Pulo

    this.cima = this.add.sprite(800, 375, 'cima', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.cima.setFrame(1)
        if (this.personagemLocal.body.blocked.down) {
          this.personagemLocal.setVelocityY(-600)
          this.personagemLocal.anims.play('pulando_' + this.personagemLado)
            .once('animationcomplete', () => {
              this.personagemLocal.anims.play('parado_' + this.personagemLado)
            })
          this.personagemLocal.setBodySize(48, 48, true)
          this.personagemLocal.setOffset(0, 0)
        }
      })
      .on('pointerout', () => {
        this.cima.setFrame(0)
      })

    // movimentação direita

    this.direita = this.add.sprite(200, 375, 'direita', 0)
      .setVisible(true)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.direita.setFrame(1)
        this.somgrama.play()
        this.personagemLocal.setVelocityX(300)
        this.personagemLado = 'direita'
        this.personagemLocal.anims.play('andando_' + this.personagemLado)
        this.personagemLocal.setBodySize(48, 48, true)
        this.personagemLocal.setOffset(0, 0)
      })
      .on('pointerout', () => {
        this.direita.setFrame(0)
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.anims.play('parado_' + this.personagemLado)
      })

    // Movimentação esquerda

    this.esquerda = this.add.sprite(64, 375, 'esquerda', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.esquerda.setFrame(1)
        this.somgrama.play()
        this.personagemLocal.setVelocityX(-300)
        this.personagemLado = 'esquerda'
        this.personagemLocal.anims.play('andando_' + this.personagemLado)
        this.personagemLocal.setBodySize(48, 48, true)
        this.personagemLocal.setOffset(0, 0)
      })
      .on('pointerout', () => {
        this.esquerda.setFrame(0)
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.anims.play('parado_' + this.personagemLado)
      })

    // Cristais em tela:

    // cristal amarelo
    this.cristalamarelo = this.add.sprite(820, 30, 'cristalamarelo', 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(3)
    // cristal vermelho
    this.cristalvermelho = this.add.sprite(780, 30, 'cristalvermelho', 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(3)
    // cristal azul
    this.cristalazul = this.add.sprite(740, 30, 'cristalazul', 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(3)
    // cristal roxo
    this.cristalroxo = this.add.sprite(700, 30, 'cristalroxo', 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(3)

    // Lado do personagem:
    this.personagemLocalLado = 'direita'

    // Morte do Personagem:
    this.physics.add.collider(this.personagemLocal, this.layerObstaculos, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 2640
      this.personagemLocal.y = 2660
      this.somarenaboss.pla
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    }, null, this)

    // INIMIGOS NO MAPA:

    // Lista dos ogros:
    // INIMIGOS NO GELO:
    this.ogros = [
      {
        x: 3600,
        y: 200,
        direita: {
          x: 3636,
          y: 230
        },
        esquerda: {
          x: 3130,
          y: 230
        },
        sprite: 'ogrogelo'
      },
      // INIMIGO NO ROXO:
      {
        x: 863,
        y: 1500,
        direita: {
          x: 1445,
          y: 1576
        },
        esquerda: {
          x: 630,
          y: 1576
        },
        sprite: 'ogroroxo'
      },
      {
        // INIMIGO NO AMARELO:
        x: 6980,
        y: 2570,
        direita: {
          x: 7200,
          y: 2570
        },
        esquerda: {
          x: 6644,
          y: 2570
        },
        sprite: 'ogroamarelo'
      },
      // INIMIGO NO FOGO:
      {
        x: 4122,
        y: 4120,
        direita: {
          x: 4322,
          y: 4126
        },
        esquerda: {
          x: 3972,
          y: 4136
        },
        sprite: 'ogrofogo'
      }
    ]

    this.ogros.forEach((ogro) => {
      ogro.objeto = this.physics.add.sprite(ogro.x, ogro.y, ogro.sprite)

      ogro.blocoDireita = this.physics.add.sprite(ogro.direita.x, ogro.direita.y, 'Vazio')
      ogro.blocoDireita.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(ogro.objeto, ogro.blocoDireita, () => {
        ogro.objeto.anims.play(ogro.sprite + '_andando_esquerda')
        ogro.objeto.setVelocityX(-80)
      }, null, this)

      ogro.blocoEsquerda = this.physics.add.sprite(ogro.esquerda.x, ogro.esquerda.y, 'Vazio')
      ogro.blocoEsquerda.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(ogro.objeto, ogro.blocoEsquerda, () => {
        ogro.objeto.anims.play(ogro.sprite + '_andando_direita')
        ogro.objeto.setVelocityX(80)
      }, null, this)

      this.physics.add.collider(ogro.objeto, this.layerChao)
      this.physics.add.collider(ogro.objeto, this.layerParedes)
      ogro.objeto.setVelocityX(-70)

      this.physics.add.overlap(this.personagemLocal, ogro.objeto, () => {
        this.cameras.main.fadeOut(200)
        this.personagemLocal.x = 2640
        this.personagemLocal.y = 2640
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
          camera.fadeIn(200)
        })
      })
    })
    // Lista dos dragaozinho:
    this.dragaozinho = [
      {
        // INIMIGOS NO FOGO:
        x: 4219,
        y: 3816,
        direita: {
          x: 4360,
          y: 3816
        },
        esquerda: {
          x: 4085,
          y: 3816
        },
        sprite: 'dragaozinhofogo'
      },
      {
        x: 3041,
        y: 4200,
        direita: {
          x: 3250,
          y: 4200
        },
        esquerda: {
          x: 2800,
          y: 4200
        },
        sprite: 'dragaozinhofogo'
      },
      {
        x: 3284,
        y: 3432,
        direita: {
          x: 3800,
          y: 3432
        },
        esquerda: {
          x: 3115,
          y: 3432
        },
        sprite: 'dragaozinhofogo'
      },
      {
        x: 2932,
        y: 3688,
        direita: {
          x: 3030,
          y: 3688
        },
        esquerda: {
          x: 2750,
          y: 3688
        },
        sprite: 'dragaozinhofogo'
      },
      {
        x: 2915,
        y: 3432,
        direita: {
          x: 3115,
          y: 3432
        },
        esquerda: {
          x: 2750,
          y: 3432
        },
        sprite: 'dragaozinhofogo'
      },
      {
        // INIMIGOS NO GELO:
        x: 4112,
        y: 232,
        direita: {
          x: 4610,
          y: 232
        },
        esquerda: {
          x: 3962,
          y: 232
        },
        sprite: 'dragaozinhogelo'
      },
      {
        x: 4482,
        y: 680,
        direita: {
          x: 4795,
          y: 680
        },
        esquerda: {
          x: 4030,
          y: 680
        },
        sprite: 'dragaozinhogelo'
      },
      {
        x: 3026,
        y: 680,
        direita: {
          x: 3322,
          y: 680
        },
        esquerda: {
          x: 2850,
          y: 680
        },
        sprite: 'dragaozinhogelo'
      },
      {
        x: 4512,
        y: 1000,
        direita: {
          x: 4640,
          y: 1000
        },
        esquerda: {
          x: 4150,
          y: 1000
        },
        sprite: 'dragaozinhogelo'
      },
      // INIMIGO NO VERDE:
      {
        x: 3135,
        y: 1702,
        direita: {
          x: 3645,
          y: 1702
        },
        esquerda: {
          x: 2557,
          y: 1702
        },
        sprite: 'dragaozinhoverde'
      },
      {
        x: 2670,
        y: 2024,
        direita: {
          x: 2985,
          y: 2024
        },
        esquerda: {
          x: 2557,
          y: 2024
        },
        sprite: 'dragaozinhoverde'
      },
      {
        x: 3560,
        y: 1960,
        direita: {
          x: 4080,
          y: 1960
        },
        esquerda: {
          x: 3265,
          y: 1960
        },
        sprite: 'dragaozinhoverde'
      },
      // INIMIGO NO AMARELO:
      {
        x: 5834,
        y: 1832,
        direita: {
          x: 6075,
          y: 1832
        },
        esquerda: {
          x: 5550,
          y: 1832
        },
        sprite: 'dragaozinho'
      },
      {
        x: 5945,
        y: 2152,
        direita: {
          x: 6260,
          y: 2152
        },
        esquerda: {
          x: 5800,
          y: 2152
        },
        sprite: 'dragaozinho'
      },
      {
        x: 6553,
        y: 1768,
        direita: {
          x: 6715,
          y: 1768
        },
        esquerda: {
          x: 6260,
          y: 1768
        },
        sprite: 'dragaozinho'
      },
      {
        x: 6194,
        y: 2600,
        direita: {
          x: 6375,
          y: 2600
        },
        esquerda: {
          x: 5810,
          y: 2600
        },
        sprite: 'dragaozinho'
      },
      {
        x: 5550,
        y: 2600,
        direita: {
          x: 5805,
          y: 2600
        },
        esquerda: {
          x: 5220,
          y: 2600
        },
        sprite: 'dragaozinho'
      },
      {
        x: 6919,
        y: 1960,
        direita: {
          x: 7098,
          y: 1960
        },
        esquerda: {
          x: 6650,
          y: 1960
        },
        sprite: 'dragaozinho'
      },
      // INIMIGOS NO ROXO:
      {
        x: 863,
        y: 1576,
        direita: {
          x: 1445,
          y: 1576
        },
        esquerda: {
          x: 615,
          y: 1576
        },
        sprite: 'dragaozinhoroxo'
      },
      {
        x: 539,
        y: 1192,
        direita: {
          x: 1010,
          y: 1192
        },
        esquerda: {
          x: 55,
          y: 1192
        },
        sprite: 'dragaozinhoroxo'
      },
      {
        x: 261,
        y: 2152,
        direita: {
          x: 430,
          y: 2152
        },
        esquerda: {
          x: 60,
          y: 2152
        },
        sprite: 'dragaozinhoroxo'
      },
      {
        x: 315,
        y: 1576,
        direita: {
          x: 600,
          y: 1576
        },
        esquerda: {
          x: 60,
          y: 1576
        },
        sprite: 'dragaozinhoroxo'
      },
      {
        x: 843,
        y: 1896,
        direita: {
          x: 1241,
          y: 1896
        },
        esquerda: {
          x: 636,
          y: 1896
        },
        sprite: 'dragaozinhoroxo'
      }
    ]

    this.dragaozinho.forEach((dragaozinho) => {
      dragaozinho.objeto = this.physics.add.sprite(dragaozinho.x, dragaozinho.y, dragaozinho.sprite)
      dragaozinho.objeto.body.setAllowGravity(false) // Disable gravity for dragaozinho
      dragaozinho.blocoDireita = this.physics.add.sprite(dragaozinho.direita.x, dragaozinho.direita.y, 'Vazio')
      dragaozinho.blocoDireita.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(dragaozinho.objeto, dragaozinho.blocoDireita, () => {
        dragaozinho.objeto.anims.play(dragaozinho.sprite + '_voando_esquerda')
        dragaozinho.objeto.setVelocityX(-70)
      }, null, this)

      dragaozinho.blocoEsquerda = this.physics.add.sprite(dragaozinho.esquerda.x, dragaozinho.esquerda.y, 'Vazio')
      dragaozinho.blocoEsquerda.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(dragaozinho.objeto, dragaozinho.blocoEsquerda, () => {
        dragaozinho.objeto.anims.play(dragaozinho.sprite + '_voando_direita')
        dragaozinho.objeto.setVelocityX(70)
      }, null, this)

      this.physics.world.removeCollider(dragaozinho)
      dragaozinho.objeto.setVelocityX(-70)

      this.physics.add.overlap(this.personagemLocal, dragaozinho.objeto, () => {
        this.cameras.main.fadeOut(200)
        this.personagemLocal.x = 2640
        this.personagemLocal.y = 2640
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
          camera.fadeIn(200)
        })
      })
    })
    // Lista dos monstros:
    this.monstros = [
      {
        x: 3600,
        y: 200,
        direita: {
          x: 3636,
          y: 230
        },
        esquerda: {
          x: 3130,
          y: 230
        },
        sprite: 'monstro'
      },
      // INIMIGO NO ROXO:
      {
        x: 863,
        y: 1500,
        direita: {
          x: 1445,
          y: 1576
        },
        esquerda: {
          x: 630,
          y: 1576
        },
        sprite: 'monstro'
      },
      {
        x: 1730,
        y: 1256,
        direita: {
          x: 1917,
          y: 1256
        },
        esquerda: {
          x: 1466,
          y: 1256
        },
        sprite: 'monstro'
      },
      {
        x: 1420,
        y: 1832,
        direita: {
          x: 1600,
          y: 1832
        },
        esquerda: {
          x: 1200,
          y: 1832
        },
        sprite: 'monstro'
      },
      // INIMIGO NO VERDE:
      {
        x: 3375,
        y: 2664,
        direita: {
          x: 3461,
          y: 2664
        },
        esquerda: {
          x: 3000,
          y: 2664
        },
        sprite: 'monstro'
      },
      {
        x: 3870,
        y: 2280,
        direita: {
          x: 4015,
          y: 2280
        },
        esquerda: {
          x: 3639,
          y: 2280
        },
        sprite: 'monstro'
      }
    ]

    this.monstros.forEach((monstro) => {
      monstro.objeto = this.physics.add.sprite(monstro.x, monstro.y, monstro.sprite)

      monstro.blocoDireita = this.physics.add.sprite(monstro.direita.x, monstro.direita.y, 'Vazio')
      monstro.blocoDireita.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(monstro.objeto, monstro.blocoDireita, () => {
        monstro.objeto.anims.play(monstro.sprite + '_andando_esquerda')
        monstro.objeto.setVelocityX(-80)
      }, null, this)

      monstro.blocoEsquerda = this.physics.add.sprite(monstro.esquerda.x, monstro.esquerda.y, 'Vazio')
      monstro.blocoEsquerda.body
        .setAllowGravity(false)
        .setImmovable(true)
      this.physics.add.collider(monstro.objeto, monstro.blocoEsquerda, () => {
        monstro.objeto.anims.play(monstro.sprite + '_andando_direita')
        monstro.objeto.setVelocityX(80)
      }, null, this)

      this.physics.add.collider(monstro.objeto, this.layerChao)
      this.physics.add.collider(monstro.objeto, this.layerParedes)
      monstro.objeto.setVelocityX(-70)

      this.physics.add.overlap(this.personagemLocal, monstro.objeto, () => {
        this.cameras.main.fadeOut(200)
        this.personagemLocal.x = 2640
        this.personagemLocal.y = 2640
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
          camera.fadeIn(200)
        })
      })
    })

    // PORTAIS:

    // Portal Verde para Roxo:
    this.portal1 = this.physics.add.sprite(2500, 2130, 'Vazio')
    this.portal1.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal1, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 1981
      this.personagemLocal.y = 2152
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Roxo para Verde:
    this.portal2 = this.physics.add.sprite(2048, 2152, 'Vazio')
    this.portal2.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal2, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 2650
      this.personagemLocal.y = 2150
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Verde para Amarelo:
    this.portal3 = this.physics.add.sprite(4800, 2152, 'Vazio')
    this.portal3.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal3, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 5291
      this.personagemLocal.y = 2132
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Amarelo para Verde:
    this.portal4 = this.physics.add.sprite(5180, 2152, 'Vazio')
    this.portal4.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal4, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 4720
      this.personagemLocal.y = 2132
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Verde para Gelo:
    this.portal5 = this.physics.add.sprite(3794, 1530, 'Vazio')
    this.portal5.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal5, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 3840
      this.personagemLocal.y = 1000
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Gelo para Verde:
    this.portal6 = this.physics.add.sprite(3780, 1200, 'Vazio')
    this.portal6.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal6, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 3795
      this.personagemLocal.y = 1650
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Grama para Fogo:
    this.portal7 = this.physics.add.sprite(3980, 2800, 'Vazio')
    this.portal7.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal7, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 3984
      this.personagemLocal.y = 3250
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal Fogo para Verde:
    this.portal8 = this.physics.add.sprite(3984, 3129, 'Vazio')
    this.portal8.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal8, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 4000
      this.personagemLocal.y = 2630
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal inicio para Verde:
    this.portal9 = this.physics.add.sprite(6577, 1030, 'Vazio')
    this.portal9.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal9, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 2640
      this.personagemLocal.y = 2660
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Portal verde para inicio:
    this.portal10 = this.physics.add.sprite(2543, 2660, 'Vazio')
    this.portal10.body.setAllowGravity(false)
    this.physics.add.overlap(this.personagemLocal, this.portal10, () => {
      this.cameras.main.fadeOut(200)
      this.personagemLocal.x = 6500
      this.personagemLocal.y = 1060
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        camera.fadeIn(200)
      })
    })

    // Detalhes do mapa
    this.layerDetalhes = this.tilemapMapa.createLayer('Detalhes', [this.tilesetPedrinhas, this.tilesetGramas, this.tilesetGramasAmarela,
      this.tilesetGramasAzul, this.tilesetGramasVermelho, this.tilesetGramasRoxo])

    // colisão de personagens:

    this.layerChao.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerChao)

    this.layerParedes.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerParedes)

    this.layerObstaculos.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerObstaculos)

    // colisão dos altares e porta:

    // porta do boss
    if (this.personagemLocal) {
      this.physics.add.overlap(this.personagemLocal, this.PortaBoss, () => {
        if (this.cristalamarelo.visible && this.cristalazul.visible && this.cristalvermelho.visible && this.cristalroxo.visible) {
          this.PortaBoss.anims.play('PortaBoss')
          this.somporta.play()
          this.cristalamarelo.setVisible(false)
          this.cristalvermelho.setVisible(false)
          this.cristalazul.setVisible(false)
          this.cristalroxo.setVisible(false)
          this.direita.setVisible(false)
          this.esquerda.setVisible(false)
        } else if (this.PortaBoss.anims.currentFrame && this.PortaBoss.anims.currentFrame.index === 8) {
          // Portal verde para boss:
          this.portalboss = this.physics.add.sprite(3615, 2650, 'Vazio')
          this.portalboss.body.setAllowGravity(false)
          this.somarenaboss.play()
          this.direita.setVisible(true)
          this.esquerda.setVisible(true)
          this.physics.add.overlap(this.personagemLocal, this.portalboss, () => {
            this.cameras.main.fadeOut(200)
            this.personagemLocal.x = 682
            this.personagemLocal.y = 3580
            this.cameras.main.once('camerafadeoutcomplete', (camera) => {
              camera.fadeIn(200)
            })
          })
        }
      })
    }

    // altar de gelo
    this.altarcristalgelo.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.altarcristalgelo, () => {
      this.somcristal.play()
      this.cristalazul.setVisible(true)
      this.altarcristalgelo.setFrame(1)
    }, null, this)

    // altar de fogo
    this.altarcristalfogo.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.altarcristalfogo, () => {
      this.somcristal.play()
      this.cristalvermelho.setVisible(true)
      this.altarcristalfogo.setFrame(1)
    }, null, this)

    // altar amarelo
    this.altarcristalamarelo.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.altarcristalamarelo, () => {
      this.somcristal.play()
      this.cristalamarelo.setVisible(true)
      this.altarcristalamarelo.setFrame(1)
    }, null, this)

    // altar roxo
    this.altarcristalroxo.body.setImmovable(true)
    this.physics.add.collider(this.personagemLocal, this.altarcristalroxo, () => {
      this.somcristal.play()
      this.cristalroxo.setVisible(true)
      this.altarcristalroxo.setFrame(1)
    }, null, this)

    // colisão do monstrogelo:
    this.layerChao.setCollisionByProperty({ collides: true })

    // criação da camera que irá serguir o personagem
    this.cameras.main.startFollow(this.personagemLocal)

    // Conexão com o servidor
    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagemLocal) {
        this.personagemRemoto.x = dados.personagemLocal.x
        this.personagemRemoto.y = dados.personagemLocal.y
        this.personagemRemoto.setTexture(dados.personagemLocal.animacao)
        this.personagemRemoto.setFrame(dados.personagemLocal.frame)
      }
      // BAÚ + finalfeliz:
      this.physics.add.overlap(this.personagemLocal, this.bau, () => {
        try {
          if (globalThis.game.dadosJogo.readyState === 'open') {
            globalThis.game.dadosJogo.send(JSON.stringify({ gameover: true }))
          }
        } catch (err) {
          console.error(err)
        }
        this.scene.stop('mapa')
        this.scene.start('finalFeliz')
      }, null, this)

      // final triste para o outro jogador
      globalThis.game.dadosJogo.onmessage = (event) => {
        const dados = JSON.parse(event.data)

        // Verifica se os dados recebidos contêm informações sobre o personagem
        if (dados.personagemLocal) {
          this.personagemRemoto.x = dados.personagemLocal.x
          this.personagemRemoto.y = dados.personagemLocal.y
          this.personagemRemoto.setFrame(dados.personagemLocal.frame)
        }

        if (dados.gameover) {
          this.scene.stop('mapa')
          this.scene.start('finalTriste')
        }
      }
    }
  }

  update () {
    try {
      if (globalThis.game.dadosJogo.readyState === 'open') {
        if (this.personagemLocal) {
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagemLocal.x,
              y: this.personagemLocal.y,
              animacao: this.personagemLocal.texture.key,
              frame: this.personagemLocal.frame.name
            }
          }))
        }
      }
    } catch (error) {
      console.log('Erro ao enviar dados do jogo: ', error)
    }
  }
}
