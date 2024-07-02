export default class tilemapMapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.audio('mapa', './assets/mapa.mp3')
    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')
    this.load.image('blocos', './assets/mapa/blocos.png')
    this.load.image('grama', './assets/mapa/grama.png')
    this.load.image('itens', './assets/mapa/itens.png')
    this.load.image('paredes', './assets/mapa/paredes.png')
    this.load.image('pedras', './assets/mapa/pedras.png')
    this.load.image('plantas', './assets/mapa/plantas.png')
    this.load.image('sombras-plantas', './assets/mapa/sombras-plantas.png')
    this.load.image('sombras', './assets/mapa/sombras.png')

    this.load.spritesheet('salsicha-caramelo', './assets/salsicha-caramelo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('cima', './assets/cima.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('baixo', './assets/baixo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('esquerda', './assets/esquerda.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('direita', './assets/direita.png', { frameWidth: 64, frameHeight: 64 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create () {
    // Configuração do mapa e do personagem
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    this.tilesetBlocos = this.tilemapMapa.addTilesetImage('blocos')
    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')
    this.tilesetParedes = this.tilemapMapa.addTilesetImage('paredes')
    this.tilesetPedras = this.tilemapMapa.addTilesetImage('pedras')
    this.tilesetPersonagem = this.tilemapMapa.addTilesetImage('personagem')
    this.tilesetPlantas = this.tilemapMapa.addTilesetImage('plantas')
    this.tilesetSombrasPlantas = this.tilemapMapa.addTilesetImage('sombras-plantas')
    this.tilesetSombras = this.tilemapMapa.addTilesetImage('sombras')

    this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetGrama])
    this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetSombrasPlantas, this.tilesetSombras])
    this.layerPlantas = this.tilemapMapa.createLayer('plantas', [this.tilesetPlantas])
    this.layerItens = this.tilemapMapa.createLayer('itens', [this.tilesetItens])
    this.layerParedes = this.tilemapMapa.createLayer('paredes', [this.tilesetBlocos, this.tilesetParedes])

    // Criação do personagem e suas animações
    this.personagem = this.physics.add.sprite(400, 225, 'salsicha-caramelo')
    this.anims.create({
      key: 'salsicha-caramelo-parado',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    })
    this.anims.create({
      key: 'salsicha-caramelo-direita',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 3, end: 1 }),
      frameRate: 7,
      repeat: -1
    })
    this.anims.create({
      key: 'salsicha-caramelo-esquerda',
      frames: this.anims.generateFrameNumbers('salsicha-caramelo', { start: 8, end: 6 }),
      frameRate: 7,
      repeat: -1
    })
    this.personagem.anims.play('salsicha-caramelo-parado')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 500,
      radius: 50,
      base: this.add.circle(100, 500, 50, 0x888888),
      thumb: this.add.circle(100, 500, 25, 0xcccccc)
    })

    // Lógica para movimentar o personagem com base no joystick virtual
    this.joystick.on('update', this.handleJoystickMove, this)

    // Início do follow da câmera
    this.cameras.main.startFollow(this.personagem)
  }

  update () {
    this.handleJoystickMove()
  }

  handleJoystickMove () {
    const speed = 100 // Velocidade do movimento do personagem

    // Movimenta o personagem com base na direção do joystick
    const angle = this.joystick.angle
    const distance = this.joystick.force

    this.personagem.setVelocityX(Math.cos(angle) * speed * distance)
    this.personagem.setVelocityY(Math.sin(angle) * speed * distance)

    // Animação do personagem conforme a direção do movimento
    if (distance > 0.1) {
      if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
        // Direita
        this.personagem.anims.play('salsicha-caramelo-direita', true)
      } else if (angle > Math.PI / 4 && angle < 3 * Math.PI / 4) {
        // Para baixo
        this.personagem.anims.play('salsicha-caramelo-parado', true)
      } else if (angle < -Math.PI / 4 && angle > -3 * Math.PI / 4) {
        // Para cima
        this.personagem.anims.play('salsicha-caramelo-esquerda', true)
      } else {
        // Esquerda
        this.personagem.anims.play('salsicha-caramelo-esquerda', true)
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagem.anims.play('salsicha-caramelo-parado', true)
    }
  }
}
