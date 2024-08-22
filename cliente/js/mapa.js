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
    this.load.spritesheet('salsicha-caramelo', './assets/salsicha-caramelo.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('salsicha-marrom', './assets/salsicha-marrom.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('cachorroquentinho', './assets/cachorroquentinho.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('ketchup', './assets/ketchup.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('mostarda', './assets/mostarda.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('tomate', './assets/tomate.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('meia', './assets/meia.png', { frameWidth: 48, frameHeight: 48 })

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
    this.layerColisao = this.tilemapMapa.createLayer('Colisao', [this.tilesettiles])
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
      this.personagemLocal = this.physics.add.sprite(-1150, -250, 'salsicha-caramelo')
      this.personagemRemoto = this.physics.add.sprite(-50, 1380, 'salsicha-marrom')
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
      this.personagemLocal = this.physics.add.sprite(-50, 1380, 'salsicha-marrom')
      this.personagemRemoto = this.physics.add.sprite(-1150, -250, 'salsicha-caramelo')
    } else {
      // Gera mensagem de log para informar que o usuário está fora da partida
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')

      // Encerra a cena atual e inicia a cena de sala
      this.scene.stop('mapa')
      this.scene.start('sala')
    }

    // Define o atributo do tileset para gerar colisão
    this.layerColisao.setCollisionByProperty({ collides: true })
    this.layerChao.setCollisionByProperty({ collides: true })
    this.layerCaminhoMadeira.setCollisionByProperty({ collides: true })
    this.layerCaminhoObjetoscenario2.setCollisionByProperty({ collides: true })

    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerColisao)
    this.physics.add.collider(this.personagemLocal, this.layerChao)
    this.physics.add.collider(this.personagemLocal, this.layerCaminhoMadeira)
    this.physics.add.collider(this.personagemLocal, this.layerCaminhoObjetoscenario2)

    this.anims.create({
      key: 'salsicha-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 4, end: 4 }),
      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'salsicha-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 9, end: 9 }),
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

    this.anims.create({
      key: 'cachorro-pulando',
      frames: this.anims.generateFrameNumbers('cachorroquentinho', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'tomate-pulando',
      frames: this.anims.generateFrameNumbers('tomate', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'ketchup-pulando',
      frames: this.anims.generateFrameNumbers('ketchup', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'mostarda-pulando',
      frames: this.anims.generateFrameNumbers('mostarda', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'meia-pulando',
      frames: this.anims.generateFrameNumbers('meia', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'cachorro-coletado',
      frames: this.anims.generateFrameNumbers('cachorroquentinho', { start: 5, end: 9 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'tomate-coletado',
      frames: this.anims.generateFrameNumbers('tomate', { start: 5, end: 9 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'ketchup-coletado',
      frames: this.anims.generateFrameNumbers('ketchup', { start: 5, end: 9 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'mostarda-coletado',
      frames: this.anims.generateFrameNumbers('mostarda', { start: 5, end: 9 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'meia-coletado',
      frames: this.anims.generateFrameNumbers('meia', { start: 4, end: 8 }),
      frameRate: 12
    })

    this.pontos = 0

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    }).on('update', this.handleJoystickMove, this)

    // Início do follow da câmera
    this.cameras.main.startFollow(this.personagemLocal)
    this.cameras.main.setZoom(1.2)
    this.personagemLocal.lado = 'direita'

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
        if (dados.tomate) {
          // Atualiza a visibilidade dos cartões
          this.tomate.forEach((tomate, i) => {
            // Atualiza a visibilidade do cartão
            if (!dados.tomate[i].visible) {
              tomate.objeto.disableBody(true, true)
            }
          })
        }
      }
      if (dados.tomates) {
        // Atualiza a visibilidade dos cartões
        this.tomates.forEach((tomate, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.tomate[i].visible) {
            tomate.objeto.disableBody(true, true)
          }
        })
      }
      if (dados.mostardas) {
        // Atualiza a visibilidade dos cartões
        this.mostardas.forEach((mostarda, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.mostarda[i].visible) {
            mostarda.objeto.disableBody(true, true)
          }
        })
      }
      if (dados.cachorros) {
        // Atualiza a visibilidade dos cartões
        this.cachorros.forEach((cachorro, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.cachorro[i].visible) {
            cachorro.objeto.disableBody(true, true)
          }
        })
      }
      if (dados.ketchups) {
        // Atualiza a visibilidade dos cartões
        this.ketchups.forEach((ketchup, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.ketchup[i].visible) {
            ketchup.objeto.disableBody(true, true)
          }
        })
      }

      if (dados.gameover) {
        this.scene.stop('mapa')
        this.scene.start('finalTriste')
      }
    }

    this.tomates = [
      {
        indice: 1,
        x: -927,
        y: -386
      },
      {
        indice: 3,
        x: -477,
        y: 1091
      },
      {
        indice: 4,
        x: -984,
        y: 21
      }
    ]
    this.tomates.forEach((tomate) => {
      tomate.objeto = this.physics.add.sprite(tomate.x, tomate.y, 'tomate')
      tomate.objeto.anims.play('tomate-pulando')
      tomate.overlap = this.physics.add.overlap(this.personagemLocal, tomate.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        tomate.overlap.destroy()

        // Anima a nuvem
        tomate.objeto.anims.play('tomate-coletado')

        // Assim que a animação terminar...
        tomate.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          tomate.objeto.disableBody(true, true)
        })
      }, null, this)
    })
    this.mostardas = [
      {
        indice: 2,
        x: -772,
        y: -454
      },
      {
        indice: 3,
        x: -77,
        y: 906
      },
      {
        indice: 4,
        x: -1040,
        y: 18
      }
    ]
    this.mostardas.forEach((mostarda) => {
      mostarda.objeto = this.physics.add.sprite(mostarda.x, mostarda.y, 'mostarda')
      mostarda.objeto.anims.play('mostarda-pulando')
      mostarda.overlap = this.physics.add.overlap(this.personagemLocal, mostarda.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        mostarda.overlap.destroy()

        // Anima a nuvem
        mostarda.objeto.anims.play('mostarda-coletado')

        // Assim que a animação terminar...
        mostarda.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          mostarda.objeto.disableBody(true, true)
        })
      }, null, this)
    })
    this.meias = [
      {
        indice: 1,
        x: -424,
        y: 124
      },
      {
        indice: 2,
        x: -72,
        y: 760
      },
      {
        indice: 3,
        x: -1121,
        y: 1424
      }
    ]
    this.meias.forEach((meia) => {
      meia.objeto = this.physics.add.sprite(meia.x, meia.y, 'meia')
      meia.objeto.anims.play('meia-pulando')
      meia.overlap = this.physics.add.overlap(this.personagemLocal, meia.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        meia.overlap.destroy()

        // Anima a nuvem
        this.scene.stop('mapa')
        this.scene.start('finalTriste')
      }, null, this)
    })
    this.cachorros = [
      {
        indice: 1,
        x: -518,
        y: 727
      },
      {
        indice: 2,
        x: -1122,
        y: 1169
      },
      {
        indice: 3,
        x: -83,
        y: -254
      }
    ]
    this.cachorros.forEach((cachorro) => {
      cachorro.objeto = this.physics.add.sprite(cachorro.x, cachorro.y, 'cachorroquentinho')
      cachorro.objeto.anims.play('cachorro-pulando')
      cachorro.overlap = this.physics.add.overlap(this.personagemLocal, cachorro.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        cachorro.overlap.destroy()

        // Anima a nuvem
        cachorro.objeto.anims.play('cachorro-coletado')
        // Assim que a animação terminar...
        cachorro.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          cachorro.objeto.disableBody(true, true)
        })
      }, null, this)
    })
    this.ketchups = [
      {
        indice: 1,
        x: -712,
        y: 1062
      },
      {
        indice: 2,
        x: -1109,
        y: 21
      },
      {
        indice: 3,
        x: -194,
        y: -437
      }
    ]
    this.ketchups.forEach((ketchup) => {
      ketchup.objeto = this.physics.add.sprite(ketchup.x, ketchup.y, 'ketchup')
      ketchup.objeto.anims.play('ketchup-pulando')
      ketchup.overlap = this.physics.add.overlap(this.personagemLocal, ketchup.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        ketchup.overlap.destroy()

        // Anima a nuvem
        ketchup.objeto.anims.play('ketchup-coletado')
        ketchup.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          ketchup.objeto.disableBody(true, true)
        })
      }, null, this)
    })

    this.timeout = 300
    this.timerText = this.add.text(70, 45, this.timeout, {
      fontSize: '28px',
      fill: '#ffffff', // Cor chamativa
      fontFamily: 'Comic Sans MS',
      stroke: '#ffffff', // Cor da borda
      strokeThickness: 2, // Espessura da borda
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 1,
        stroke: true,
        fill: true
      }
    }).setScrollFactor(0)

    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeout--
        this.timerText.setText(this.timeout)

        if (this.timeout <= 0) {
          this.timer.destroy()
          this.scene.stop('mapa')
          this.scene.start('finalTriste')
        }
      },
      callbackScope: this,
      loop: true
    })
  }

  update () {
    try {
      // Envia os dados do jogo somente se houver conexão aberta
      if (globalThis.game.dadosJogo.readyState === 'open') {
        // Verifica se o personagem local existe
        if (this.personagemLocal) {
          // Envia os dados do personagem local via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagemLocal.x,
              y: this.personagemLocal.y,
              frame: this.personagemLocal.frame.name
            }
          }));
        }

        if (this.tomates) {
          // Envia os dados dos tomates via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            tomates: this.tomates.map(tomate => ({
              visible: tomate.objeto.visible
            }))
          }));
        }

        if (this.tomates) {
          const tomatesColetados = this.tomates.filter(tomate => !tomate.objeto.active).length;
          this.pontosTexto.setText(`Comidas: ${tomatesColetados}`);
        }
        if (this.tomates) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            tomate: this.tomates.map(tomate => (tomate => ({
              visible: tomate.objeto.visible
            }))(tomate))
          }))
        }
        if (this.mostardas) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            mostarda: this.mostardas.map(mostarda => (mostarda => ({
              visible: mostarda.objeto.visible
            }))(mostarda))
          }))
        }
        if (this.cachorros) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            cachorro: this.cachorros.map(cachorro => (cachorro => ({
              visible: cachorro.objeto.visible
            }))(cachorro))
          }))
        }
        if (this.ketchups) {
          // Envia os dados dos cartoes via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            ketchup: this.ketchups.map(ketchup => (ketchup => ({
              visible: ketchup.objeto.visible
            }))(ketchup))
          }))
        }
        this.pontos.setText('Ingredientes: ' + [this.tomates, this.mostardas, this.cachorros, this.ketchups].flat().filter(ingrediente => !ingrediente.objeto.visible).length)
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do jogo: ', error);
    }
  }
} // Add the missing closing brace here

handleJoystickMove() {
  const speed = 120; // Velocidade constante do personagem
  const threshold = 0.1; // Limite mínimo de força para considerar o movimento

  // Movimenta o personagem com base na direção do joystick
  const angle = Phaser.Math.DegToRad(this.joystick.angle); // Converte o ângulo para radianos
  const force = this.joystick.force;

  if (force > threshold) {
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    this.personagemLocal.setVelocity(velocityX, velocityY);

    console.log('x: ', this.personagemLocal.x);
    console.log('y: ', this.personagemLocal.y);

    // Animação do personagem conforme a direção do movimento
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      if (velocityX > 0) {
        this.personagemLocal.lado = 'direita';
        this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true);
      } else {
        this.personagemLocal.lado = 'esquerda';
        this.personagemLocal.anims.play('salsicha-' + this.personagemLocal.lado, true);
      }
    } else {
      if (velocityY > 0) {
        // Adicione a animação para baixo se houver uma
        this.personagemLocal.anims.play('salsicha-baixo', true);
      } else {
        // Adicione a animação para cima se houver uma
        this.personagemLocal.anims.play('salsicha-cima', true);
      }
    }
  } else {
    // Se a força do joystick for baixa, o personagem para
    this.personagemLocal.setVelocity(0);
    if (this.personagemLocal.lado === 'esquerda') {
      this.personagemLocal.anims.play('salsicha-parado-esquerda', true);
    } else {
      this.personagemLocal.anims.play('salsicha-parado-direita', true);
    }
  }
}