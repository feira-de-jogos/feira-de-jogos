export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carrega os sons

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
    this.load.spritesheet('Belinha', './assets/Belinha.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega as imagens dos botões
    this.load.image('cima', './assets/botoes/cima.png')
    this.load.image('baixo', './assets/botoes/baixo.png')
    this.load.image('esquerda', './assets/botoes/esquerda.png')
    this.load.image('direita', './assets/botoes/direita.png')
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
    } else {
      // Gera mensagem de log para informar que o usuário está fora da partida
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')

      // Encerra a cena atual e inicia a cena de sala
      globalThis.game.scene.stop('mapa')
      globalThis.game.scene.start('sala')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerSob.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerSob)

    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Toca o som da coruja
        this.corujaPio.play()

        // Altera o frame do botão para pressionado
        this.cima.setFrame(1)

        // Altera o frame do botão para o estado original
        this.cima.setFrame(0)

    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Toca o som da coruja
        this.corujaPio.play()

        // Altera o frame do botão para pressionado
        this.baixo.setFrame(1)


    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {

        // Altera o frame do botão para pressionado
        this.esquerda.setFrame(1)

        // Muda a variável de controle do lado do personagem
        this.personagemLocal.lado = 'esquerda'
          
    
        // Altera o frame do botão para o estado original
        this.esquerda.setFrame(0)

    this.direita = this.add.sprite(700, 350, 'direita', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
      

        // Altera o frame do botão para pressionado
        this.direita.setFrame(1)

        // Altera o frame do botão para o estado original
        this.direita.setFrame(0)

    // Inicia a câmera seguindo o personagem
    this.cameras.main.startFollow(this.personagemLocal)

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

      update()


    }
  }
}
