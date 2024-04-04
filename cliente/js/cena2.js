export default class cena2 extends Phaser.Scene {
  constructor () {
    super('cena2')
  }

  preload () {
    this.load.image('escola2', './assets/escola2.png')
    this.load.spritesheet('amy', './assets/amy.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('jake', './assets/jake.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('georgina', './assets/georgina.png', { frameWidth: 160, frameHeight: 220 })
    this.load.spritesheet('lara', './assets/lara.png', { frameWidth: 160, frameHeight: 220 })
  }

  create () {
    this.estados = [
      {
        texto: {
          x: 450,
          y: 230,
          conteudo: 'Ei, você!'
        },
        imagem: {
          x: 100,
          y: 300,
          imagem: 'amy'
        }
      },
      {
        texto: {
          x: 450,
          y: 230,
          conteudo: 'Hola, que tal!'
        },
        imagem: {
          x: 600,
          y: 300,
          imagem: 'jake'
        }
      }
    ]
    this.estadoAtual = 0

    this.add.image(400, 225, 'escola2')
      .setInteractive()
      .on('pointerdown', () => {
        this.texto.destroy()

        this.estadoAtual++

        this.texto = this.add.text(
          this.estados[this.estadoAtual].texto.x,
          this.estados[this.estadoAtual].texto.y,
          this.estados[this.estadoAtual].texto.conteudo
        )
        this.imagem = this.add.image(
          this.estados[this.estadoAtual].imagem.x,
          this.estados[this.estadoAtual].imagem.y,
          this.estados[this.estadoAtual].imagem.conteudo
        )
      })

    this.anims.create({
      key: 'amy-falando',
      frames: this.anims.generateFrameNumbers('amy', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: 2
    })

    this.anims.create({
      key: 'jake-falando',
      frames: this.anims.generateFrameNumbers('jake', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: 2
    })

    this.anims.create({
      key: 'georgina-falando',
      frames: this.anims.generateFrameNumbers('georgina', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.anims.create({
      key: 'lara-falando',
      frames: this.anims.generateFrameNumbers('lara', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    })

    this.texto = this.add.text(
      this.estados[this.estadoAtual].texto.x,
      this.estados[this.estadoAtual].texto.y,
      this.estados[this.estadoAtual].texto.conteudo
    )
    this.imagem = this.add.sprite(100, 300, 'amy').setScale(1.5)
  }

  update () {
  }
}
