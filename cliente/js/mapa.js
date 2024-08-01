export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carrega os sons

    // Carrega o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')

    // Carrega as imagens do mapa
    this.load.image('grama', './assets/mapa/grama.png')
    this.load.image('cerca', './assets/mapa/cerca.png')
    this.load.image('arvore', './assets/mapa/arvore.png')
    this.load.image('casa', './assets/mapa/casa.png')
    this.load.image('arbusto', './assets/mapa/arbusto.png')

    // Carrega o personagem
    this.load.spritesheet('Boo', './assets/personagens/Boo.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('Missy', './assets/personagens/Missy.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega as imagens dos botões
    this.load.image('cima', './assets/botoes/cima.png')
    this.load.image('baixo', './assets/botoes/baixo.png')
    this.load.image('esquerda', './assets/botoes/esquerda.png')
    this.load.image('direita', './assets/botoes/direita.png')

    this.load.spritesheet('cookie', './assets/cookies.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('moedinha', './assets/moedinha.png', { frameWidth: 32, frameHeight: 32 })
  }

  create () {
    // Adiciona um ponteiro de toque (padrão: 2)
    this.input.addPointer(3)

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
      this.personagemLocal = this.physics.add.sprite(200, 200, 'Missy')
      this.personagemRemoto = this.add.sprite(200, 200, 'Boo')
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
      this.personagemLocal = this.physics.add.sprite(200, 200, 'Boo')
      this.personagemRemoto = this.add.sprite(200, 200, 'Missy')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerCerca.setCollisionByProperty({ collides: true })
    this.layerArbusto.setCollisionByProperty({ collides: true })

    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerCerca, () => { this.personagemLocal.anims.play('personagem-parado-baixo') }, null, this)
    this.physics.add.collider(this.personagemLocal, this.layerArbusto, () => { this.personagemLocal.anims.play('personagem-parado-baixo') }, null, this)

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
        start: 4,
        end: 4
      }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-caminhando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 3,
        end: 5
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
        start: 6,
        end: 9
      }),
      frameRate: 10,
      repeat: -1
    })

    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Toca o som da coruja
        // this.corujaPio.play()
      })

    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.setVelocityY(-150)
        this.personagemLocal.anims.play('personagem-caminhando-cima')
      })

    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.personagemLocal.setVelocityX(0)
        this.personagemLocal.setVelocityY(150)
        this.personagemLocal.anims.play('personagem-caminhando-baixo')
      })

    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        // Muda a variável de controle do lado do personagem
        this.personagemLocal.lado = 'esquerda'

        this.personagemLocal.setVelocityY(0)
        this.personagemLocal.setVelocityX(-150)
        this.personagemLocal.anims.play('personagem-caminhando-esquerda')
      })

    this.direita = this.add.sprite(700, 350, 'direita', 0)
      .setScrollFactor(0) // não se move com a câmera
      .setInteractive() // permite interação com o sprite
      .on('pointerdown', () => {
        this.personagemLocal.setVelocityY(0)
        this.personagemLocal.setVelocityX(150)
        this.personagemLocal.anims.play('personagem-caminhando-direita')
      })

    // Inicia a câmera seguindo o personagem
    this.cameras.main.startFollow(this.personagemLocal)

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
        x: 4998,
        y: 7584
      },
      {
        x: 3474,
        y: 8224
      },
      {
        x: 2660,
        y: 7776
      },
      {
        x: 6624,
        y: 6873
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
      }
    ]
    // Animaçao da moedinha
    this.anims.create({
      key: 'moedinha',
      frames: this.anims.generateFrameNumbers('moedinha', {
        start: 0,
        end: 0
      }),
      frameRate: 5,
      repeat: -1
    })

    this.moedinha.forEach((moedinha) => {
      moedinha.objeto = this.physics.add.sprite(moedinha.x, moedinha.y, 'moedinha')
      moedinha.objeto.anims.play('moedinha')
      moedinha.colisao = this.physics.add.overlap(this.personagemLocal, moedinha.objeto, () => {
        moedinha.objeto.disableBody(true, true)

        const moedinhaColetados = this.moedinha.filter(moedinha => !moedinha.objeto.active).length
        if (moedinhaColetados > 6) {
          this.scene.stop('mapa')
          this.scene.start('finalFeliz')
        }
      }, null, this)
    })

    // posições dos cookies
    this.cookies = [
      {
        x: 32,
        y: 80
      },
      {
        x: 4998,
        y: 7584
      },
      {
        x: 3474,
        y: 8224
      },
      {
        x: 2660,
        y: 7776
      },
      {
        x: 6624,
        y: 6873
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
      },
      {
        x: 5830,
        y: 5216
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
        cookie.objeto.disableBody(true, true)

        const cookiesColetados = this.cookies.filter(cookie => !cookie.objeto.active).length
        if (cookiesColetados > 6) {
          this.scene.stop('mapa')
          this.scene.start('finalFeliz')
        }
      }, null, this)
    })

    // Processa as mensagens recebidas via DataChannel
    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }

      // Verifica se os dados recebidos contêm informações sobre os cookies
      if (dados.cookies) {
        // Atualiza a visibilidade dos cartões
        this.cookies.forEach((cookie, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.cookies[i].visible) {
            cookie.objeto.disableBody(true, true)
          }
        })
      }
    }
  }

  update () {
    // Alguns frames podem estar (ainda) sem personagem ou nuvem,
    // por isso é necessário verificar se existem antes de enviar
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

        if (this.cookies) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            cookies: this.cookies.map(cookie => (cookie => ({
              visible: cookie.objeto.visible
            }))(cookie))
          }))
        }
      }
    } catch (error) {
      // Gera mensagem de erro na console
      console.error(error)
    }
  }
}
