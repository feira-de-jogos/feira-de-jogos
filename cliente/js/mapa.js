export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
    this.direcaoAtual = 'frente' // Variável para armazenar a direção atual do personagem
    this.teleportCooldown = false // Variável para gerenciar o cooldown do teleporte
  }

  preload () {
    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapaindustrial.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tileindustrial64pxgeral.png')
   
    // Carregar spritesheets
    this.load.spritesheet('personagem', './assets/personagens/Alex.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocoquebra', './assets/animaçoes/card.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create () {
    // Adiciona ponteiro
    this.input.addPointer(3)

    // Cria objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
      this.tilesetChao = this.tilemapMapa.addTilesetImage('geral')
    this.tilesetParedes = this.tilemapMapa.addTilesetImage('paredes')
    
    // Camadas do mapa e personagem
      this.layerchao = this.tilemapMapa.createLayer('chao', [this.tileindustrial64pxgeral])
      this.layerparedes = this.tilemapMapa.createLayer('paredes', [this.tileindustrial64pxgeral])
    



    

    // Define o atributo do tileset para gerar colisão
    this.layerparedemsm.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagem, this.layerparedemsm)

    // Define o atributo do tileset para gerar colisão
    this.layerarbustos.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagem, this.layerarbustos)

    // Torna a cena acessível globalmente
    window.scene = this

    // Movimentos do personagem
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 6, end: 11 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 48, end: 53 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 27, end: 32 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 69, end: 74 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 23, end: 26 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 42, end: 47 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 65, end: 68 }),
      frameRate: 8,
      repeat: -1
    })

    this.personagem.anims.play('personagem-parado-frente')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 120,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })

    // Câmera
    this.cameras.main.startFollow(this.personagem)

    // Variáveis de velocidade e threshold
    this.speed = 100 // Velocidade constante do personagem
    this.threshold = 0.1 // Limite mínimo de força para considerar o movimento
  }

  update () {
    this.handleJoystickMove()
    this.checkTeleport()
  }

  handleJoystickMove () {
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {
      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.personagem.setVelocity(velocityX, velocityY)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagem.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
        } else {
          this.personagem.anims.play('personagem-andando-esquerda', true)
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          this.personagem.anims.play('personagem-andando-frente', true)
          this.direcaoAtual = 'frente'
        } else {
          this.personagem.anims.play('personagem-andando-tras', true)
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagem.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          this.personagem.anims.play('personagem-parado-frente', true)
          break
        case 'direita':
          this.personagem.anims.play('personagem-parado-direita', true)
          break
        case 'esquerda':
          this.personagem.anims.play('personagem-parado-esquerda', true)
          break
        case 'tras':
          this.personagem.anims.play('personagem-parado-tras', true)
          break
      }
    }
  }

  checkTeleport () {
    // Verifica se o cooldown está ativo
    if (this.teleportCooldown) {
      return
    }

    // Verifica se o personagem está nas proximidades das coordenadas especificadas para ida
    if (this.personagem.x >= 2275 && this.personagem.x <= 2295 && this.personagem.y >= 678 && this.personagem.y <= 698) {
      this.personagem.setPosition(560, 1236)
      this.activateTeleportCooldown()
    }

    // Verifica se o personagem está nas proximidades das coordenadas especificadas para volta
    else if (this.personagem.x >= 535 && this.personagem.x <= 550 && this.personagem.y >= 1226 && this.personagem.y <= 1246) {
      this.personagem.setPosition(2285, 688)
      this.activateTeleportCooldown()
    }
    // Verifica se o personagem está nas coordenadas especificadas
    if (this.personagem.x === 528 && this.personagem.y === 272) {
      // Define a nova posição do personagem
      this.personagem.setPosition(2285, 410)
    }
  }

  activateTeleportCooldown () {
    this.teleportCooldown = true
    this.time.addEvent({
      delay: 500, // Tempo de cooldown em milissegundos
      callback: () => {
        this.teleportCooldown = false
      }
    })
  }
}