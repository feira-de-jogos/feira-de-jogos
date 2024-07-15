export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    //Carrega os sons


    // Carrega o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')

    // Carrega as imagens do mapa
    this.load.image('blocos', './assets/mapa/blocos.png')
    this.load.image('grama', './assets/mapa/grama.png')
    this.load.image('itens', './assets/mapa/itens.png')
    this.load.image('paredes', './assets/mapa/paredes.png')
    this.load.image('pedras', './assets/mapa/pedras.png')
    this.load.image('plantas', './assets/mapa/plantas.png')
    this.load.image('sombras-plantas', './assets/mapa/sombras-plantas.png')
    this.load.image('sombras', './assets/mapa/sombras.png')

    // Carrega o personagem
    this.load.spritesheet('Belinha', './assets/Belinha.png', {frameWidth: 32, frameHeight: 32})
  
    //Carrega as imagens dos botões

  }

  create () {
    // Adiciona um ponteiro de toque (padrão: 2)
    this.input.addPointer(3)

    // Cria o objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetBlocos = this.tilemapMapa.addTilesetImage('blocos')
    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')
    this.tilesetParedes = this.tilemapMapa.addTilesetImage('paredes')
    this.tilesetPedras = this.tilemapMapa.addTilesetImage('pedras')
    this.tilesetPlantas = this.tilemapMapa.addTilesetImage('plantas')
    this.tilesetSombrasPlantas = this.tilemapMapa.addTilesetImage('sombras-plantas')
    this.tilesetSombras = this.tilemapMapa.addTilesetImage('sombras')

    // Cria as camadas do mapa
    this.layerFundo = this.tilemapMapa.createLayer('Fundo', [this.tilesetGrama])
    this.layerSob = this.tilemapMapa.createLayer('Sob', [this.tilesetParedes])

this.belinha = this.physics.add.sprite(0, 0, 'Belinha')

this.cameras.main.startFollow(this.belinha)

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
  this.personagemLocal = this.physics.add.sprite(400, 225, 'belinha')
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
  this.personagemLocal = this.physics.add.sprite(400, 225, 'belinha')
 
  // Gera mensagem de log para informar que o usuário está fora da partida
  console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')

  // Encerra a cena atual e inicia a cena de sala
  globalThis.game.scene.stop('mapa')
  globalThis.game.scene.start('sala')
}

// Define o atributo do tileset para gerar colisão
this.layerParedes.setCollisionByProperty({ collides: true })
// Adiciona colisão entre o personagem e as paredes
this.physics.add.collider(this.personagemLocal, this.layerParedes)

this.anims.create({
  key: 'personagem-parado-esquerda',
  frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
    start: 0,
    end: 1
  }),
  frameRate: 1,
  repeat: -1
})

this.anims.create({
  key: 'personagem-voando-esquerda',
  frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
    start: 2,
    end: 5
  }),
  frameRate: 10,
  repeat: -1
})

this.anims.create({
  key: 'personagem-parado-direita',
  frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
    start: 6,
    end: 7
  }),
  frameRate: 1,
  repeat: -1
})

this.anims.create({
  key: 'personagem-voando-direita',
  frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
    start: 8,
    end: 11
  }),
  frameRate: 10,
  repeat: -1
})

this.cima = this.add.sprite(100, 250, 'cima', 0)
  .setScrollFactor(0) // não se move com a câmera
  .setInteractive() // permite interação com o sprite
  .on('pointerdown', () => {
    // Toca o som da coruja
    this.corujaPio.play()

    // Altera o frame do botão para pressionado
    this.cima.setFrame(1)

    // Faz o personagem voar para cima
    this.personagemLocal.setVelocityY(-100)

    // Anima o personagem voando
    this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
  })
  .on('pointerup', () => {
    // Altera o frame do botão para o estado original
    this.cima.setFrame(0)

    // Para o personagem
    this.personagemLocal.setVelocityY(0)

    // Se o personagem não estiver se movendo na horizontal, anima o personagem parado
    if (this.personagemLocal.body.velocity.x === 0) {
      this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
    }
  })

this.baixo = this.add.sprite(100, 350, 'baixo', 0)
  .setScrollFactor(0) // não se move com a câmera
  .setInteractive() // permite interação com o sprite
  .on('pointerdown', () => {
    // Toca o som da coruja
    this.corujaPio.play()

    // Altera o frame do botão para pressionado
    this.baixo.setFrame(1)

    // Faz o personagem voar para baixo
    this.personagemLocal.setVelocityY(100)

    // Anima o personagem voando
    this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
  })
  .on('pointerup', () => {
    // Altera o frame do botão para o estado original
    this.baixo.setFrame(0)

    // Para o personagem
    this.personagemLocal.setVelocityY(0)

    // Se o personagem não estiver se movendo na horizontal, anima o personagem parado
    if (this.personagemLocal.body.velocity.x === 0) {
      this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
    }
  })

this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
  .setScrollFactor(0) // não se move com a câmera
  .setInteractive() // permite interação com o sprite
  .on('pointerdown', () => {
    // Toca o som da coruja
    this.corujaPio.play()

    // Altera o frame do botão para pressionado
    this.esquerda.setFrame(1)

    // Faz o personagem voar para a esquerda
    this.personagemLocal.setVelocityX(-100)

    // Muda a variável de controle do lado do personagem
    this.personagemLocal.lado = 'esquerda'

    // Anima o personagem voando
    this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
  })
  .on('pointerup', () => {
    // Altera o frame do botão para o estado original
    this.esquerda.setFrame(0)

    // Para o personagem
    this.personagemLocal.setVelocityX(0)

    // Se o personagem não estiver se movendo na vertical, anima o personagem parado
    if (this.personagemLocal.body.velocity.y === 0) {
      this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
    }
  })

this.direita = this.add.sprite(700, 350, 'direita', 0)
  .setScrollFactor(0) // não se move com a câmera
  .setInteractive() // permite interação com o sprite
  .on('pointerdown', () => {
    // Toca o som da coruja
    this.corujaPio.play()

    // Altera o frame do botão para pressionado
    this.direita.setFrame(1)

    // Faz o personagem voar para a direita
    this.personagemLocal.setVelocityX(100)

    // Muda a variável de controle do lado do personagem
    this.personagemLocal.lado = 'direita'

    // Anima o personagem voando
    this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
  })
  .on('pointerup', () => {
    // Altera o frame do botão para o estado original
    this.direita.setFrame(0)

    // Para o personagem
    this.personagemLocal.setVelocityX(0)

    // Se o personagem não estiver se movendo na horizontal, anima o personagem parado
    if (this.personagemLocal.body.velocity.y === 0) {
      this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
    }
  })

// Inicia a câmera seguindo o personagem
this.cameras.main.startFollow(this.personagemLocal)

// Começa a cena com o personagem virado para a esquerda
this.personagemLocal.lado = 'esquerda'

// Começa a cena com o personagem animado parado
this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)

this.anims.create({
  key: 'nuvem',
  frames: this.anims.generateFrameNumbers('nuvem', { start: 0, end: 7 }),
  frameRate: 32
})

// Gera mensagem de log quando a conexão de dados é aberta
globalThis.game.dadosJogo.onopen = () => {
  console.log('Conexão de dados aberta!')
}

// Processa as mensagens recebidas via DataChannel
globalThis.game.dadosJogo.onmessage = (event) => {
  const dados = JSON.parse(event.data)

  // Verifica se os dados recebidos contêm informações sobre o personagem
  if (dados.personagem) {
    this.personagemRemoto.x = dados.personagem.x
    this.personagemRemoto.y = dados.personagem.y
    this.personagemRemoto.setFrame(dados.personagem.frame)
  }

  update () 
  
  
  }}}
