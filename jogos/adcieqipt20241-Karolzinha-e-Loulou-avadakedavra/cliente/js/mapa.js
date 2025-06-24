import Phaser from 'phaser'

export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
    this.direcaoAtual = 'frente' // Variável para armazenar a direção atual do personagem
    this.teleportCooldown = false // Variável para gerenciar o cooldown do teleporte
    this.aranhasAndam = false
    this.batsAndam = false
    this.slimesAndam = false
    this.fantasmasAndam = false
    this.beybladesAndam = false
  }

  preload () {
    this.load.audio('musga', './assets/audios/musga.mp3')
    this.load.audio('coletar', './assets/audios/coletar.mp3')
    this.load.audio('coletar2', './assets/audios/coletar2.mp3')
    this.load.audio('bat', './assets/audios/bat.mp3')
    this.load.audio('slimemorre', './assets/audios/slimemorre.mp3')
    this.load.audio('slimepulo', './assets/audios/slimepulo.mp3')
    this.load.audio('hurt', './assets/audios/hurt.mp3')
    this.load.audio('shin', './assets/audios/shin.mp3')

    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/umapinha.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tilesetnovo.png')
    this.load.image('masmorra', './assets/mapa/tilesetnovodungeon.png')
    this.load.image('moveisbruxa', './assets/mapa/moveisbruxa.png')
    this.load.image('torre', './assets/mapa/torrebruxa.png')

    // Carregar spritesheets
    this.load.spritesheet('mago', './assets/personagens/mago.png', { frameWidth: 48, frameHeight: 59 })
    this.load.spritesheet('menino', './assets/personagens/menino.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('menina', './assets/personagens/menina.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('meninoataque', './assets/personagens/meninoataque.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('meninaataque', './assets/personagens/meninaataque.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('blocoquebra', './assets/animacoes/blocoquebra.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('armadilha', './assets/animacoes/armadilha.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('armadilhafake', './assets/animacoes/armadilhafake.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('aranha', './assets/inimigos/aranha.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('bat', './assets/inimigos/bat.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('slime', './assets/inimigos/slime.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('fantasma', './assets/inimigos/fantasma.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('beyblade', './assets/inimigos/beyblade.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('cristal', './assets/animacoes/cristal.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('grade', './assets/animacoes/grade.png', { frameWidth: 32, frameHeight: 64 })
    this.load.spritesheet('botaograde', './assets/animacoes/botaograde.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('pocaorosa', './assets/animacoes/pocaorosa.png', { frameWidth: 28, frameHeight: 56 })
    this.load.spritesheet('pocaoverde', './assets/animacoes/pocaoverde.png', { frameWidth: 28, frameHeight: 56 })
    this.load.spritesheet('pocaoazul', './assets/animacoes/pocaoazul.png', { frameWidth: 28, frameHeight: 56 })
    this.load.spritesheet('pocaoverme', './assets/animacoes/pocaoverme.png', { frameWidth: 28, frameHeight: 56 })
    this.load.spritesheet('agua', './assets/animacoes/agua.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('aguaborda', './assets/animacoes/aguaborda.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('vida', './assets/vida.png', { frameWidth: 146, frameHeight: 36 })
    this.load.spritesheet('buraco', './assets/buraco.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocovazio', './assets/blocovazio.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocovazio2', './assets/blocovazio2.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocovazio3', './assets/blocovazio3.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocovazio4', './assets/blocovazio4.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocovazio5', './assets/blocovazio5.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)

    // Carrega botao de ataque
    this.load.spritesheet('botao', './assets/botao.png', { frameWidth: 48, frameHeight: 48 })
  }

  create () {
    // Adiciona ponteiro
    this.input.addPointer(3)

    this.sound.add('musga', { loop: true }).play()
    this.coletar = this.sound.add('coletar')
    this.coletar2 = this.sound.add('coletar2')
    this.batsom = this.sound.add('bat')
    this.slimemorre = this.sound.add('slimemorre')
    this.slimepulo = this.sound.add('slimepulo')
    this.hurt = this.sound.add('hurt')
    this.shin = this.sound.add('shin')

    // Cria objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetFloresta = this.tilemapMapa.addTilesetImage('geral')
    this.tilesetMasmorra = this.tilemapMapa.addTilesetImage('masmorra')
    this.tilesetMoveisbruxa = this.tilemapMapa.addTilesetImage('moveisbruxa')
    this.tilesetTorre = this.tilemapMapa.addTilesetImage('torre')

    // Camadas do mapa e personagem
    this.layerchaofaltando = this.tilemapMapa.createLayer('chaofaltando', [this.tilesetFloresta])
    // Animações agua
    this.anims.create({
      key: 'botaograde-pressio',
      frames: this.anims.generateFrameNumbers('botaograde', {
        start: 0,
        end: 1
      }),
      frameRate: 8
    })
    this.anims.create({
      key: 'grade-desce',
      frames: this.anims.generateFrameNumbers('grade', {
        start: 0,
        end: 7
      }),
      frameRate: 4
    })
    this.anims.create({
      key: 'agua-anim',
      frames: this.anims.generateFrameNumbers('agua', {
        start: 0,
        end: 7
      }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'aguaborda-anim',
      frames: this.anims.generateFrameNumbers('aguaborda', {
        start: 0,
        end: 7
      }),
      frameRate: 8,
      repeat: -1
    })

    // riozinho
    this.rio = [
      { indice: 1, x: 2352, y: 976 },
      { indice: 2, x: 2320, y: 976 },
      { indice: 3, x: 2288, y: 976 },
      { indice: 4, x: 2256, y: 976 },
      { indice: 5, x: 2224, y: 976 },
      { indice: 6, x: 2192, y: 976 },
      { indice: 7, x: 2160, y: 976 },
      { indice: 8, x: 2128, y: 976 },
      { indice: 9, x: 2096, y: 976 },
      { indice: 10, x: 2064, y: 976 },
      { indice: 11, x: 2032, y: 976 },
      { indice: 12, x: 2000, y: 976 },
      { indice: 13, x: 1968, y: 976 },
      { indice: 14, x: 1936, y: 976 },
      { indice: 15, x: 1904, y: 976 },
      { indice: 16, x: 1872, y: 976 },
      { indice: 17, x: 1840, y: 976 },
      { indice: 18, x: 1808, y: 976 },
      { indice: 19, x: 1776, y: 976 },
      { indice: 20, x: 2384, y: 976 },
      { indice: 21, x: 2416, y: 976 },
      { indice: 22, x: 2448, y: 976 },
      { indice: 23, x: 2480, y: 976 },
      { indice: 24, x: 2512, y: 976 },
      { indice: 25, x: 2544, y: 976 },
      { indice: 26, x: 2576, y: 976 },
      { indice: 27, x: 2608, y: 976 },
      { indice: 28, x: 2640, y: 976 },
      { indice: 29, x: 2672, y: 976 },
      { indice: 30, x: 2704, y: 976 },
      { indice: 31, x: 2352, y: 1008 },
      { indice: 32, x: 2320, y: 1008 },
      { indice: 33, x: 2288, y: 1008 },
      { indice: 34, x: 2256, y: 1008 },
      { indice: 35, x: 2224, y: 1008 },
      { indice: 36, x: 2192, y: 1008 },
      { indice: 37, x: 2160, y: 1008 },
      { indice: 38, x: 2128, y: 1008 },
      { indice: 39, x: 2096, y: 1008 },
      { indice: 40, x: 2064, y: 1008 },
      { indice: 41, x: 2032, y: 1008 },
      { indice: 42, x: 2000, y: 1008 },
      { indice: 43, x: 1968, y: 1008 },
      { indice: 44, x: 1936, y: 1008 },
      { indice: 45, x: 1904, y: 1008 },
      { indice: 46, x: 1872, y: 1008 },
      { indice: 47, x: 1840, y: 1008 },
      { indice: 48, x: 1808, y: 1008 },
      { indice: 49, x: 1776, y: 1008 },
      { indice: 50, x: 2384, y: 1008 },
      { indice: 51, x: 2416, y: 1008 },
      { indice: 52, x: 2448, y: 1008 },
      { indice: 53, x: 2480, y: 1008 },
      { indice: 54, x: 2512, y: 1008 },
      { indice: 55, x: 2544, y: 1008 },
      { indice: 56, x: 2576, y: 1008 },
      { indice: 57, x: 2608, y: 1008 },
      { indice: 58, x: 2640, y: 1008 },
      { indice: 59, x: 2672, y: 1008 },
      { indice: 60, x: 2704, y: 1008 },
      { indice: 61, x: 3536, y: 400 },
      { indice: 62, x: 3504, y: 400 },
      { indice: 63, x: 3472, y: 400 },
      { indice: 64, x: 3440, y: 400 },
      { indice: 65, x: 3408, y: 400 },
      { indice: 66, x: 3376, y: 400 },
      { indice: 67, x: 3344, y: 400 },
      { indice: 68, x: 3536, y: 368 },
      { indice: 69, x: 3504, y: 368 },
      { indice: 70, x: 3472, y: 368 },
      { indice: 71, x: 3440, y: 368 },
      { indice: 72, x: 3408, y: 368 },
      { indice: 73, x: 3376, y: 368 },
      { indice: 74, x: 3344, y: 368 },
      { indice: 75, x: 3312, y: 368 },
      { indice: 76, x: 3280, y: 368 },
      { indice: 77, x: 3536, y: 336 },
      { indice: 78, x: 3504, y: 336 },
      { indice: 79, x: 3472, y: 336 },
      { indice: 80, x: 3408, y: 240 },
      { indice: 81, x: 3408, y: 336 },
      { indice: 82, x: 3376, y: 336 },
      { indice: 83, x: 3344, y: 336 },
      { indice: 84, x: 3312, y: 336 },
      { indice: 85, x: 3280, y: 336 },
      { indice: 86, x: 3536, y: 304 },
      { indice: 87, x: 3504, y: 304 },
      { indice: 88, x: 3472, y: 304 },
      { indice: 89, x: 3376, y: 240 },
      { indice: 90, x: 3408, y: 304 },
      { indice: 91, x: 3376, y: 304 },
      { indice: 92, x: 3344, y: 304 },
      { indice: 93, x: 3312, y: 304 },
      { indice: 94, x: 3280, y: 304 },
      { indice: 95, x: 3536, y: 272 },
      { indice: 96, x: 3504, y: 272 },
      { indice: 97, x: 3472, y: 272 },
      { indice: 98, x: 3440, y: 272 },
      { indice: 99, x: 3408, y: 272 },
      { indice: 100, x: 3376, y: 272 },
      { indice: 101, x: 3344, y: 272 },
      { indice: 102, x: 3312, y: 272 },
      { indice: 103, x: 3280, y: 272 },
      { indice: 104, x: 3344, y: 240 },
      { indice: 105, x: 3312, y: 240 },
      { indice: 106, x: 3280, y: 240 },
      { indice: 107, x: 3408, y: 208 },
      { indice: 108, x: 3376, y: 208 },
      { indice: 109, x: 3344, y: 208 },
      { indice: 110, x: 3312, y: 208 }
    ]
    this.rio.forEach((agua) => {
      agua.objeto = this.physics.add.sprite(agua.x, agua.y, 'aguaborda')
      agua.objeto.anims.play('agua-anim')
    })
    this.rioborda = [
      { indice: 1, x: 2352, y: 944 },
      { indice: 2, x: 2320, y: 944 },
      { indice: 3, x: 2288, y: 944 },
      { indice: 4, x: 2256, y: 944 },
      { indice: 5, x: 2224, y: 944 },
      { indice: 6, x: 2192, y: 944 },
      { indice: 7, x: 2160, y: 944 },
      { indice: 8, x: 2128, y: 944 },
      { indice: 9, x: 2096, y: 944 },
      { indice: 10, x: 2064, y: 944 },
      { indice: 11, x: 2032, y: 944 },
      { indice: 12, x: 2000, y: 944 },
      { indice: 13, x: 1968, y: 944 },
      { indice: 14, x: 1936, y: 944 },
      { indice: 15, x: 1904, y: 944 },
      { indice: 16, x: 1872, y: 944 },
      { indice: 17, x: 1840, y: 944 },
      { indice: 18, x: 1808, y: 944 },
      { indice: 19, x: 1776, y: 944 },
      { indice: 20, x: 2384, y: 944 },
      { indice: 21, x: 2416, y: 944 },
      { indice: 22, x: 2448, y: 944 },
      { indice: 23, x: 2480, y: 944 },
      { indice: 24, x: 2512, y: 944 },
      { indice: 25, x: 2544, y: 944 },
      { indice: 26, x: 2576, y: 944 },
      { indice: 27, x: 2608, y: 944 },
      { indice: 28, x: 2640, y: 944 },
      { indice: 29, x: 2672, y: 944 },
      { indice: 30, x: 2704, y: 944 },
      { indice: 31, x: 3536, y: 240 },
      { indice: 32, x: 3504, y: 240 },
      { indice: 33, x: 3472, y: 240 },
      { indice: 34, x: 3440, y: 240 },
      { indice: 35, x: 3408, y: 176 },
      { indice: 36, x: 3376, y: 176 },
      { indice: 37, x: 3344, y: 176 },
      { indice: 38, x: 3312, y: 176 },
      { indice: 39, x: 3280, y: 208 }
    ]
    this.rioborda.forEach((aguaborda) => {
      aguaborda.objeto = this.physics.add.sprite(aguaborda.x, aguaborda.y, 'aguaborda')
      aguaborda.objeto.anims.play('aguaborda-anim')
    })

    this.layerchao = this.tilemapMapa.createLayer('chao', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layerparedemsm = this.tilemapMapa.createLayer('paredemsm', [this.tilesetMasmorra])
    this.layerarbustos = this.tilemapMapa.createLayer('arbustos', [this.tilesetFloresta, this.tilesetMasmorra, this.tilesetMoveisbruxa, this.tilesetTorre])
    this.layerflores = this.tilemapMapa.createLayer('flores', [this.tilesetFloresta])

    this.anims.create({
      key: 'bloco-quebrando',
      frames: this.anims.generateFrameNumbers('blocoquebra', {
        start: 0,
        end: 8
      }),
      frameRate: 8
    })

    this.anims.create({
      key: 'armadilha-anim',
      frames: this.anims.generateFrameNumbers('armadilha', {
        start: 0,
        end: 25
      }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'armadilhafake-anim',
      frames: this.anims.generateFrameNumbers('armadilhafake', {
        start: 0,
        end: 25
      }),
      frameRate: 12,
      repeat: -1
    })

    this.blocosquebra = [
      { indice: 1, x: 560, y: 1008 },
      { indice: 2, x: 368, y: 848 },
      { indice: 3, x: 368, y: 656 }
    ]
    this.blocosquebra.forEach((blocoquebra) => {
      blocoquebra.objeto = this.physics.add.sprite(blocoquebra.x, blocoquebra.y, 'blocoquebra')
    })
    this.armadilhas = [
      { indice: 1, x: 720, y: 816 },
      { indice: 2, x: 720, y: 848 },
      { indice: 3, x: 432, y: 784 },
      { indice: 4, x: 944, y: 848 },
      { indice: 5, x: 1104, y: 784 },
      { indice: 6, x: 1232, y: 816 }
    ]
    this.armadilhas.forEach((armadilha) => {
      armadilha.objeto = this.physics.add.sprite(armadilha.x, armadilha.y, 'armadilha')
      armadilha.objeto.anims.play('armadilha-anim')
      if (armadilha.objeto.anims.currentFrame.index === 17) {
        this.shin.play()
      }
    })
    this.armadilhasfake = [
      { indice: 2, x: 720, y: 848 },
      { indice: 3, x: 432, y: 816 }
    ]
    this.armadilhasfake.forEach((armadilhafake) => {
      armadilhafake.objeto = this.physics.add.sprite(armadilhafake.x, armadilhafake.y, 'armadilhafake')
      armadilhafake.objeto.anims.play('armadilhafake-anim')
    })
    this.buracos = [
      { indice: 1, x: 4048, y: 110 },
      { indice: 2, x: 3315, y: 11 },
      { indice: 3, x: 1953, y: 1104 }
    ]
    this.buracos.forEach((buraco) => {
      buraco.objeto = this.physics.add.sprite(buraco.x, buraco.y, 'buraco')
    })
    this.grades = [
      { indice: 1, x: 912, y: 576 },
      { indice: 2, x: 880, y: 576 },
      { indice: 3, x: 848, y: 576 },
      { indice: 4, x: 816, y: 576 },
      { indice: 5, x: 784, y: 576 }
    ]
    this.grades.forEach((grade) => {
      grade.objeto = this.physics.add.sprite(grade.x, grade.y, 'grade')
      grade.objeto.setImmovable(true)
    })
    this.botaograde = this.physics.add.sprite(496, 816, 'botaograde')

    this.anims.create({
      key: 'aranha-andando',
      frames: this.anims.generateFrameNumbers('aranha', { start: 7, end: 10 }),
      frameRate: 9,
      repeat: -1
    })

    this.anims.create({
      key: 'aranha-some',
      frames: this.anims.generateFrameNumbers('aranha', { start: 0, end: 6 }),
      frameRate: 9
    })

    // Define o movimento du zinimigo para seguir o personagem
    this.aranhas = [
      { x: 2039, y: 784 },
      { x: 1978, y: 880 },
      { x: 2619, y: 784 },
      { x: 2282, y: 912 },
      { x: 2448, y: 1029 },
      { x: 1891, y: 1004 },
      { x: 2032, y: 1168 },
      { x: 2906, y: 1168 },
      { x: 2736, y: 1040 },
      { x: 2672, y: 1072 }
    ]
    this.aranhas.forEach((aranha) => {
      aranha.sprite = this.physics.add.sprite(aranha.x, aranha.y, 'aranha')
      aranha.sprite.anims.play('aranha-andando')
      this.physics.add.collider(aranha.sprite, this.layerparedemsm)
      this.physics.add.collider(aranha.sprite, this.layerarbustos)
    })

    this.anims.create({
      key: 'bat-esquerda',
      frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 4 }),
      frameRate: 9,
      repeat: -1
    })
    this.anims.create({
      key: 'bat-direita',
      frames: this.anims.generateFrameNumbers('bat', { start: 5, end: 9 }),
      frameRate: 9,
      repeat: -1
    })
    this.anims.create({
      key: 'bat-some',
      frames: this.anims.generateFrameNumbers('bat', { start: 10, end: 15 }),
      frameRate: 9
    })
    this.bats = [
      { x: 3003, y: 923 },
      { x: 2959, y: 868 },
      { x: 2814, y: 816 },
      { x: 3031, y: 829 }
    ]
    this.bats.forEach((bat) => {
      bat.sprite = this.physics.add.sprite(bat.x, bat.y, 'bat')
      bat.sprite.anims.play('bat-esquerda')
      this.physics.add.collider(bat.sprite, this.layerparedemsm)
      this.physics.add.collider(bat.sprite, this.layerarbustos)
    })
    this.anims.create({
      key: 'slime-andando',
      frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 5 }),
      frameRate: 9,
      repeat: -1
    })
    this.anims.create({
      key: 'slime-some',
      frames: this.anims.generateFrameNumbers('slime', { start: 6, end: 13 }),
      frameRate: 9
    })
    this.slimes = [
      { x: 490, y: 1232 },
      { x: 784, y: 1269 },
      { x: 685, y: 1392 },
      { x: 336, y: 1040 },
      { x: 240, y: 944 },
      { x: 332, y: 707 },
      { x: 624, y: 656 }
    ]
    this.slimes.forEach((slime) => {
      slime.sprite = this.physics.add.sprite(slime.x, slime.y, 'slime')
      slime.sprite.anims.play('slime-andando')
      this.physics.add.collider(slime.sprite, this.layerparedemsm)
      this.physics.add.collider(slime.sprite, this.layerarbustos)
    })
    this.anims.create({
      key: 'fantasma-andando',
      frames: this.anims.generateFrameNumbers('fantasma', { start: 0, end: 3 }),
      frameRate: 9,
      repeat: -1
    })
    this.anims.create({
      key: 'fantasma-some',
      frames: this.anims.generateFrameNumbers('fantasma', { start: 8, end: 14 }),
      frameRate: 9
    })
    this.fantasmas = [
      { x: 912, y: 624 },
      { x: 811, y: 718 },
      { x: 1220, y: 672 },
      { x: 1154, y: 805 },
      { x: 1027, y: 825 },
      { x: 973, y: 944 }
    ]
    this.fantasmas.forEach((fantasma) => {
      fantasma.sprite = this.physics.add.sprite(fantasma.x, fantasma.y, 'fantasma')
      fantasma.sprite.anims.play('fantasma-andando')
      this.physics.add.collider(fantasma.sprite, this.layerparedemsm)
      this.physics.add.collider(fantasma.sprite, this.layerarbustos)
    })

    this.anims.create({
      key: 'beyblade-andando',
      frames: this.anims.generateFrameNumbers('beyblade', { start: 0, end: 7 }),
      frameRate: 9,
      repeat: -1
    })
    this.anims.create({
      key: 'beyblade-ataque',
      frames: this.anims.generateFrameNumbers('beyblade', { start: 8, end: 10 }),
      frameRate: 12,
      repeat: 2
    })
    this.anims.create({
      key: 'beyblade-some',
      frames: this.anims.generateFrameNumbers('beyblade', { start: 11, end: 18 }),
      frameRate: 9
    })
    this.beyblades = [
      { x: 57, y: 710 },
      { x: 80, y: 944 }
    ]
    this.beyblades.forEach((beyblade) => {
      beyblade.sprite = this.physics.add.sprite(beyblade.x, beyblade.y, 'beyblade')
      beyblade.sprite.anims.play('beyblade-andando')
      this.physics.add.collider(beyblade.sprite, this.layerparedemsm)
      this.physics.add.collider(beyblade.sprite, this.layerarbustos)
    })
    this.anims.create({
      key: 'mago-parado',
      frames: this.anims.generateFrameNumbers('mago', {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    })

    this.mago = this.physics.add.sprite(2375, 432, 'mago')
    this.mago.anims.play('mago-parado')
    this.mago.setImmovable(true)

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

      // this.blocoquebra = this.physics.add.sprite(590, 1442, 'blocoquebra')
      this.personagemLocal = this.physics.add.sprite(2317, 490, 'menino')
      this.personagemRemoto = this.add.sprite(2343, 490, 'menina')
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
      this.personagemLocal = this.physics.add.sprite(2343, 490, 'menina')
      this.personagemRemoto = this.add.sprite(2317, 490, 'menino')
    }
    this.physics.add.collider(this.personagemLocal, this.mago)

    this.grades.forEach((grade) => {
      this.physics.add.collider(this.personagemLocal, grade.objeto)
    })
    this.botaograde.colisao = this.physics.add.overlap(this.personagemLocal, this.botaograde, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ botaoGradePressionado: true }))
      this.physics.world.removeCollider(this.botaograde.colisao)
      // Animação de pressionar o botão
      this.botaograde.play('botaograde-pressio')

      // Animação de "descer" para cada grade e remoção da colisão
      this.grades.forEach((grade) => {
        grade.objeto.play('grade-desce')

        // Removendo a colisão após a animação iniciar
        grade.objeto.on('animationcomplete', () => {
          grade.objeto.disableBody(true, true)
        })
      })
    }, null, this)

    this.blocosquebra.forEach((blocoquebra) => {
      blocoquebra.overlap = this.physics.add.overlap(this.personagemLocal, blocoquebra.objeto, () => {
        this.hurt.play()
        this.physics.world.removeCollider(blocoquebra.overlap)
        blocoquebra.objeto.anims.play('bloco-quebrando')
        this.personagemLocal.setTint(0xff0000)
        setTimeout(() => {
          this.physics.world.colliders.add(blocoquebra.overlap)
          this.personagemLocal.setTint(0xffffff)
        }, 1500)
        this.vida.setFrame(this.vida.frame.name + 1)
      }, null, this)
    })
    this.armadilhas.forEach((armadilha) => {
      armadilha.overlap = this.physics.add.overlap(this.personagemLocal, armadilha.objeto, () => {
        if (armadilha.objeto.anims.currentFrame.index >= 17) {
          this.hurt.play()
          this.physics.world.removeCollider(armadilha.overlap)
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(armadilha.overlap)
            this.personagemLocal.setTint(0xffffff)
          }, 1500)
          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })
    this.buracos.forEach((buraco) => {
      buraco.overlap = this.physics.add.overlap(this.personagemLocal, buraco.objeto, () => {
        this.hurt.play()
        this.physics.world.removeCollider(buraco.overlap)
        this.personagemLocal.setTint(0xff0000)
        setTimeout(() => {
          this.physics.world.colliders.add(buraco.overlap)
          this.personagemLocal.setTint(0xffffff)
        }, 1500)
        this.vida.setFrame(this.vida.frame.name + 1)
      }, null, this)
    })
    this.anims.create({
      key: 'pocaorosa-brilhando',
      frames: this.anims.generateFrameNumbers('pocaorosa', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'pocaorosa-coletado',
      frames: this.anims.generateFrameNumbers('pocaorosa', { start: 6, end: 9 }),
      frameRate: 10
    })
    this.anims.create({
      key: 'pocaoverde-brilhando',
      frames: this.anims.generateFrameNumbers('pocaoverde', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'pocaoazul-brilhando',
      frames: this.anims.generateFrameNumbers('pocaoazul', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'pocaoverme-brilhando',
      frames: this.anims.generateFrameNumbers('pocaoverme', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'pocaoverde-coletado',
      frames: this.anims.generateFrameNumbers('pocaoverde', { start: 6, end: 9 }),
      frameRate: 10
    })
    this.anims.create({
      key: 'pocaoazul-coletado',
      frames: this.anims.generateFrameNumbers('pocaoazul', { start: 6, end: 9 }),
      frameRate: 10
    })
    this.anims.create({
      key: 'pocaoverme-coletado',
      frames: this.anims.generateFrameNumbers('pocaoverme', { start: 6, end: 9 }),
      frameRate: 10
    })

    this.pocaorosa = this.physics.add.sprite(2865, 816, 'pocaorosa')
    this.pocaorosa.anims.play('pocaorosa-brilhando')
    this.pocaorosa.overlap = this.physics.add.overlap(this.personagemLocal, this.pocaorosa, () => {
      this.coletar2.play()
      // Desativa o overlap entre personagem e nuvem
      this.pocaorosa.overlap.destroy()

      // Anima a nuvem
      this.pocaorosa.anims.play('pocaorosa-coletado')

      // Assim que a animação terminar...
      this.pocaorosa.once('animationcomplete', () => {
        // Desativa a nuvem (imagem e colisão)
        this.pocaorosa.disableBody(true, true)
      })
      if (this.vida.frame.name >= 0) {
        this.vida.setFrame(this.vida.frame.name - 1)
      }
    }, null, this)

    this.pocaoverde = this.physics.add.sprite(3440, 284, 'pocaoverde')
    this.pocaoverde.anims.play('pocaoverde-brilhando')
    this.pocaoverde.overlap = this.physics.add.overlap(this.personagemLocal, this.pocaoverde, () => {
      this.coletar2.play()
      // Desativa o overlap entre personagem e nuvem
      this.pocaoverde.overlap.destroy()

      // Anima a nuvem
      this.pocaoverde.anims.play('pocaoverde-coletado')

      // Assim que a animação terminar...
      this.pocaoverde.once('animationcomplete', () => {
        // Desativa a nuvem (imagem e colisão)
        this.pocaoverde.disableBody(true, true)
        if (this.vida.frame.name >= 0) {
          this.vida.setFrame(this.vida.frame.name - 1)
        }
      })
    }, null, this)
    this.pocaoazul = this.physics.add.sprite(3440, 284, 'pocaoazul')
    this.pocaoazul.anims.play('pocaoazul-brilhando')
    this.pocaoazul.overlap = this.physics.add.overlap(this.personagemLocal, this.pocaoazul, () => {
      this.coletar2.play()
      // Desativa o overlap entre personagem e nuvem
      this.pocaoazul.overlap.destroy()

      // Anima a nuvem
      this.pocaoazul.anims.play('pocaoazul-coletado')

      // Assim que a animação terminar...
      this.pocaoazul.once('animationcomplete', () => {
        // Desativa a nuvem (imagem e colisão)
        this.pocaoazul.disableBody(true, true)
        if (this.vida.frame.name >= 0) {
          this.vida.setFrame(this.vida.frame.name - 1)
        }
      })
    }, null, this)
    this.pocaoverme = this.physics.add.sprite(800, 478, 'pocaoverme')
    this.pocaoverme.anims.play('pocaoverme-brilhando')
    this.pocaoverme.overlap = this.physics.add.overlap(this.personagemLocal, this.pocaoverme, () => {
      this.coletar2.play()
      // Desativa o overlap entre personagem e nuvem
      this.pocaoverme.overlap.destroy()

      // Anima a nuvem
      this.pocaoverme.anims.play('pocaoverme-coletado')

      // Assim que a animação terminar...
      this.pocaoverme.once('animationcomplete', () => {
        // Desativa a nuvem (imagem e colisão)
        this.pocaoverme.disableBody(true, true)
        if (this.vida.frame.name >= 0) {
          this.vida.setFrame(this.vida.frame.name - 1)
        }
      })
    }, null, this)

    this.blocovazio = this.physics.add.sprite(2320, 747, 'blocovazio')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ aranhasAndam: true }))
      this.aranhasAndam = true
    }, null, this)
    this.blocovazio2 = this.physics.add.sprite(2864, 1008, 'blocovazio2')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio2, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ batsAndam: true }))
      this.batsAndam = true
    }, null, this)
    this.blocovazio3 = this.physics.add.sprite(433, 1392, 'blocovazio3')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio3, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ slimesAndam: true }))
      this.slimesAndam = true
    }, null, this)
    this.blocovazio4 = this.physics.add.sprite(752, 832, 'blocovazio4')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio4, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ fantasmasAndam: true }))
      this.fantasmasAndam = true
    }, null, this)
    this.blocovazio5 = this.physics.add.sprite(174, 817, 'blocovazio5')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio5, () => {
      globalThis.game.dadosJogo.send(JSON.stringify({ beybladesAndam: true }))
      this.beybladesAndam = true
    }, null, this)

    this.anims.create({
      key: 'grade-descendo',
      frames: this.anims.generateFrameNumbers('grade', { start: 0, end: 7 }),
      frameRate: 8
    })
    this.aranhas.forEach((aranha) => {
      aranha.colisao = this.physics.add.overlap(aranha.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(aranha.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          this.batsom.play()
          aranha.sprite.anims.play('aranha-some')
          aranha.sprite.once('animationcomplete', () => {
            aranha.sprite.disableBody(true, true)
          })
        } else {
          this.hurt.play()
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(aranha.colisao)
            this.personagemLocal.setTint(0xffffff)
          }, 1000)

          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })
    this.bats.forEach((bat) => {
      bat.colisao = this.physics.add.overlap(bat.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(bat.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          this.batsom.play()
          bat.sprite.anims.play('bat-some')
          bat.sprite.once('animationcomplete', () => {
            bat.sprite.disableBody(true, true)
          })
        } else {
          this.hurt.play()
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(bat.colisao)
            this.personagemLocal.setTint(0xffffff)
          }, 1000)

          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })
    this.slimes.forEach((slime) => {
      slime.colisao = this.physics.add.overlap(slime.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(slime.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          this.slimemorre.play()
          slime.sprite.anims.play('slime-some')
          slime.sprite.once('animationcomplete', () => {
            slime.sprite.disableBody(true, true)
          })
        } else {
          this.hurt.play()
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(slime.colisao)
            this.personagemLocal.setTint(0xffffff)
          }, 1000)

          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })
    this.fantasmas.forEach((fantasma) => {
      fantasma.colisao = this.physics.add.overlap(fantasma.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(fantasma.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          fantasma.sprite.anims.play('fantasma-some')
          fantasma.sprite.once('animationcomplete', () => {
            fantasma.sprite.disableBody(true, true)
          })
        } else {
          this.hurt.play()
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(fantasma.colisao)
            this.personagemLocal.setTint(0xffffff)
          }, 1000)

          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })
    this.beyblades.forEach((beyblade) => {
      beyblade.colisao = this.physics.add.overlap(beyblade.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(beyblade.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          beyblade.sprite.anims.play('beyblade-some')
          beyblade.sprite.once('animationcomplete', () => {
            beyblade.sprite.disableBody(true, true)
          })
        } else {
          beyblade.sprite.anims.play('beyblade-ataque')
          beyblade.sprite.once('animationcomplete', () => {
            this.hurt.play()
            this.personagemLocal.setTint(0xff0000)
            setTimeout(() => {
              this.physics.world.colliders.add(beyblade.colisao)
              this.personagemLocal.setTint(0xffffff)
            }, 1000)

            this.vida.setFrame(this.vida.frame.name + 1)
          })
        }
      }, null, this)
    })
    this.layerpersonagempassa = this.tilemapMapa.createLayer('personagempassa', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layertorre = this.tilemapMapa.createLayer('torre', [this.tilesetTorre])

    this.vida = this.add.sprite(220, 100, 'vida', 0)
      .setScrollFactor(0)

    // Define o atributo do tileset para gerar colisão
    this.layerparedemsm.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerparedemsm)

    // Define o atributo do tileset para gerar colisão
    this.layerarbustos.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerarbustos)

    // Animação cristal
    this.anims.create({
      key: 'cristal-girando',
      frames: this.anims.generateFrameNumbers('cristal', {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'cristal-coletado',
      frames: this.anims.generateFrameNumbers('cristal', {
        start: 6,
        end: 10
      }),
      frameRate: 10,
      repeat: 0
    })

    this.cristais = [
      { indice: 1, x: 2320, y: 602 },
      { indice: 2, x: 2320, y: 660 },
      { indice: 3, x: 2320, y: 789 },
      { indice: 4, x: 2320, y: 848 },
      { indice: 5, x: 2201, y: 848 },
      { indice: 6, x: 2062, y: 848 },
      { indice: 7, x: 1858, y: 848 },
      { indice: 8, x: 2418, y: 850 },
      { indice: 9, x: 2531, y: 848 },
      { indice: 10, x: 2640, y: 848 },
      { indice: 11, x: 2418, y: 1035 },
      { indice: 12, x: 2204, y: 1104 },
      { indice: 13, x: 1840, y: 1104 },
      { indice: 14, x: 2045, y: 1104 },
      { indice: 15, x: 2535, y: 1104 },
      { indice: 16, x: 2535, y: 1104 },
      { indice: 17, x: 2318, y: 1104 },
      { indice: 18, x: 2702, y: 1136 },
      { indice: 19, x: 2859, y: 1136 },
      { indice: 20, x: 3218, y: 848 },
      { indice: 21, x: 3413, y: 848 },
      { indice: 22, x: 3403, y: 718 },
      { indice: 23, x: 3403, y: 594 },
      { indice: 24, x: 3570, y: 848 },
      { indice: 25, x: 3820, y: 746 },
      { indice: 26, x: 3511, y: 957 },
      { indice: 27, x: 3169, y: 1095 },
      { indice: 28, x: 3512, y: 1085 },
      { indice: 29, x: 3893, y: 1037 },
      { indice: 30, x: 3973, y: 892 },
      { indice: 31, x: 370, y: 1264 },
      { indice: 32, x: 769, y: 1323 },
      { indice: 33, x: 735, y: 1341 },
      { indice: 34, x: 62, y: 894 },
      { indice: 35, x: 870, y: 470 },
      { indice: 36, x: 576, y: 352 },
      { indice: 37, x: 918, y: 576 },
      { indice: 38, x: 1158, y: 736 },
      { indice: 39, x: 1222, y: 896 },
      { indice: 40, x: 870, y: 822 }
    ]
    this.cristais.forEach((cristal) => {
      cristal.objeto = this.physics.add.sprite(cristal.x, cristal.y, 'cristal')
      cristal.objeto.anims.play('cristal-girando')
      cristal.overlap = this.physics.add.overlap(this.personagemLocal, cristal.objeto, () => {
        this.coletar.play()
        // Desativa o overlap entre personagem e nuvem
        cristal.overlap.destroy()

        // Anima a nuvem
        cristal.objeto.anims.play('cristal-coletado')

        // Assim que a animação terminar...
        cristal.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          cristal.objeto.disableBody(true, true)
        })
      }, null, this)
    })

    // Movimentos do personagem
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 6, end: 11 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 48, end: 53 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 27, end: 32 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 69, end: 74 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 0, end: 5 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 21, end: 26 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 6, end: 11 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 42, end: 47 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 12, end: 17 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 63, end: 68 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 18, end: 23 }),
      frameRate: 12,
      repeat: 1
    })

    // Inicia a animação padrão do personagem
    this.personagemLocal.anims.play('personagem-parado-frente')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })
    this.botao = this.add.sprite(600, 310, 'botao', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        this.botao.setFrame(1)
        this.personagemAtacando = true
        this.personagemLocal.anims.play('personagem-ataque-' + this.direcaoAtual)
          .on('animationcomplete', () => {
            this.personagemAtacando = false
          })
      })
      .on('pointerup', () => {
        this.botao.setFrame(0)
      })
    // Câmera
    this.cameras.main.startFollow(this.personagemLocal)
    this.cameras.main.setZoom(1.5)

    // Variáveis de velocidade e threshold
    this.speed = 125 // Velocidade constante do personagem
    this.threshold = 0.1 // Limite mínimo de força para considerar o movimento

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      if (dados.aranhasAndam) {
        this.aranhasAndam = true
      }
      if (dados.batsAndam) {
        this.batsAndam = true
      }
      if (dados.slimesAndam) {
        this.slimesAndam = true
      }
      if (dados.fantasmasAndam) {
        this.fantasmasAndam = true
      }
      if (dados.beybladesAndam) {
        this.beybladesAndam = true
      }

      if (dados.gameover) {
        this.scene.stop('mapa')
        this.scene.start('finalTriste')
      }

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }

      if (dados.cristais) {
        this.cristais.forEach((cristal, i) => {
          if (!dados.cristais[i].visible) {
            cristal.objeto.disableBody(true, true)
          }
        })
      }

      if (dados.aranhas) {
        this.aranhas.forEach((aranha, i) => {
          if (!dados.aranhas[i].visible) {
            aranha.sprite.disableBody(true, true)
          }
        })
      }
      if (dados.bats) {
        this.bats.forEach((bat, i) => {
          if (!dados.bats[i].visible) {
            bat.sprite.disableBody(true, true)
          }
        })
      }
      if (dados.slimes) {
        this.slimes.forEach((slime, i) => {
          if (!dados.slimes[i].visible) {
            slime.sprite.disableBody(true, true)
          }
        })
      }
      if (dados.fantasmas) {
        this.fantasmas.forEach((fantasma, i) => {
          if (!dados.fantasmas[i].visible) {
            fantasma.sprite.disableBody(true, true)
          }
        })
      }
      if (dados.beyblades) {
        this.beyblades.forEach((beyblade, i) => {
          if (!dados.beyblades[i].visible) {
            beyblade.sprite.disableBody(true, true)
          }
        })
      }

      if (dados.botaoGradePressionado) {
        this.physics.world.removeCollider(this.botaograde.colisao)
        // Animação de pressionar o botão
        this.botaograde.play('botaograde-pressio')

        // Animação de "descer" para cada grade e remoção da colisão
        this.grades.forEach((grade) => {
          grade.objeto.play('grade-desce')

          // Removendo a colisão após a animação iniciar
          grade.objeto.on('animationcomplete', () => {
            grade.objeto.disableBody(true, true)
          })
        })
      }
    }
    this.pontos = this.add.text(500, 85, 0, {
      fontFamily: 'Roboto',
      fontSize: '25px',
      stroke: '#000000',
      strokeThickness: 4,
      fill: '#ffffff'
    }).setScrollFactor(0)
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

          if (this.cristais) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              cristais: this.cristais.map(cristal => (cristal => ({
                visible: cristal.objeto.visible
              }))(cristal))
            }))
          }

          if (this.aranhas) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              aranhas: this.aranhas.map(aranha => (aranha => ({
                visible: aranha.sprite.visible
              }))(aranha))
            }))
          }
          if (this.bats) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              bats: this.bats.map(bat => (bat => ({
                visible: bat.sprite.visible
              }))(bat))
            }))
          }
          if (this.slimes) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              slimes: this.slimes.map(slime => (slime => ({
                visible: slime.sprite.visible
              }))(slime))
            }))
          }
          if (this.fantasmas) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              fantasmas: this.fantasmas.map(fantasma => (fantasma => ({
                visible: fantasma.sprite.visible
              }))(fantasma))
            }))
          }
          if (this.beyblades) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              beyblades: this.beyblades.map(beyblade => (beyblade => ({
                visible: beyblade.sprite.visible
              }))(beyblade))
            }))
          }
        }
        this.pontos.setText('cristais: ' + this.cristais.filter(cristal => !cristal.objeto.active).length + '/40')
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do jogo: ', error)
    }

    if (this.aranhas && this.aranhasAndam) {
      this.aranhas.forEach((aranha) => {
        // aranha segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          this.personagemLocal.y,
          aranha.sprite.x,
          aranha.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          this.personagemRemoto.y,
          aranha.sprite.x,
          aranha.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo aranha
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - aranha.sprite.x
        if (diffX >= 10) {
          aranha.sprite.setVelocityX(50)
        } else if (diffX <= 10) {
          aranha.sprite.setVelocityX(-50)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - aranha.sprite.y
        if (diffY >= 10) {
          aranha.sprite.setVelocityY(50)
        } else if (diffY <= 10) {
          aranha.sprite.setVelocityY(-50)
        }
      })
    }

    if (this.bats && this.batsAndam) {
      this.bats.forEach((bat) => {
        // bat segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          this.personagemLocal.y,
          bat.sprite.x,
          bat.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          this.personagemRemoto.y,
          bat.sprite.x,
          bat.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo bat
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - bat.sprite.x
        if (diffX >= 10) {
          bat.sprite.setVelocityX(50)
        } else if (diffX <= 10) {
          bat.sprite.setVelocityX(-50)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - bat.sprite.y
        if (diffY >= 10) {
          bat.sprite.setVelocityY(50)
        } else if (diffY <= 10) {
          bat.sprite.setVelocityY(-50)
        }
      })
    }

    if (this.slimes && this.slimesAndam) {
      this.slimes.forEach((slime) => {
        // slime segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          this.personagemLocal.y,
          slime.sprite.x,
          slime.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          this.personagemRemoto.y,
          slime.sprite.x,
          slime.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo slime
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - slime.sprite.x
        if (diffX >= 10) {
          slime.sprite.setVelocityX(50)
        } else if (diffX <= 10) {
          slime.sprite.setVelocityX(-50)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - slime.sprite.y
        if (diffY >= 10) {
          slime.sprite.setVelocityY(50)
        } else if (diffY <= 10) {
          slime.sprite.setVelocityY(-50)
        }
      })
    }
    if (this.fantasmas && this.fantasmasAndam) {
      this.fantasmas.forEach((fantasma) => {
        // fantasma segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          this.personagemLocal.y,
          fantasma.sprite.x,
          fantasma.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          this.personagemRemoto.y,
          fantasma.sprite.x,
          fantasma.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo fantasma
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - fantasma.sprite.x
        if (diffX >= 10) {
          fantasma.sprite.setVelocityX(50)
        } else if (diffX <= 10) {
          fantasma.sprite.setVelocityX(-50)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - fantasma.sprite.y
        if (diffY >= 10) {
          fantasma.sprite.setVelocityY(50)
        } else if (diffY <= 10) {
          fantasma.sprite.setVelocityY(-50)
        }
      })
    }
    if (this.beyblades && this.beybladesAndam) {
      this.beyblades.forEach((beyblade) => {
        // beyblade segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          this.personagemLocal.y,
          beyblade.sprite.x,
          beyblade.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          this.personagemRemoto.y,
          beyblade.sprite.x,
          beyblade.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo beyblade
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - beyblade.sprite.x
        if (diffX >= 10) {
          beyblade.sprite.setVelocityX(50)
        } else if (diffX <= 10) {
          beyblade.sprite.setVelocityX(-50)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - beyblade.sprite.y
        if (diffY >= 10) {
          beyblade.sprite.setVelocityY(50)
        } else if (diffY <= 10) {
          beyblade.sprite.setVelocityY(-50)
        }
      })
    }

    if (this.vida.frame.name === 3) {
      globalThis.game.dadosJogo.send(JSON.stringify({ gameover: true }))
      this.scene.stop('mapa')
      this.scene.start('finalTriste')
    }

    const cristaisColetados = this.cristais.filter(cristal => !cristal.objeto.active).length
    if (cristaisColetados === this.cristais.length) {
      this.scene.stop('mapa')
      this.scene.start('final')
    }
    this.handleJoystickMove()
    this.checkTeleport()
  }

  handleJoystickMove () {
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {
      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.personagemLocal.setVelocity(velocityX, velocityY)

      // console.log('x: ', this.personagemLocal.x)
      // console.log('y: ', this.personagemLocal.y)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-direita', true)
          }
          this.direcaoAtual = 'direita'
        } else {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-esquerda', true)
          }
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-frente', true)
          }
          this.direcaoAtual = 'frente'
        } else {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-tras', true)
          }
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-frente', true)
          }
          break
        case 'direita':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-direita', true)
          }
          break
        case 'esquerda':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-esquerda', true)
          }
          break
        case 'tras':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-tras', true)
          }
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
    if (this.personagemLocal.x === 3824 && this.personagemLocal.y === 656) {
      this.personagemLocal.setPosition(433, 1392)
      this.activateTeleportCooldown()
    } else if (this.personagemLocal.x >= 412 && this.personagemLocal.x <= 456 && this.personagemLocal.y === 1392) {
      this.personagemLocal.setPosition(3824, 688)
      this.activateTeleportCooldown()
    }
  }

  activateTeleportCooldown () {
    this.teleportCooldown = true
    this.time.addEvent({
      delay: 1000, // Tempo de cooldown em milissegundos
      callback: () => {
        this.teleportCooldown = false
      }
    })
  }
}
