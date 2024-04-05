export default class cena2 extends Phaser.Scene {
  constructor () {
    super('cena2')
  }

  preload () {
    this.load.image('escola2', './assets/escola2.png')
    this.load.spritesheet('amy', './assets/amy.png', { frameWidth: 160, frameHeight: 225 })
    this.load.spritesheet('jake', './assets/jake.png', { frameWidth: 160, frameHeight: 225 })
    this.load.spritesheet('georgina', './assets/georgina.png', { frameWidth: 160, frameHeight: 225 })
    this.load.spritesheet('lara', './assets/lara.png', { frameWidth: 160, frameHeight: 225 })
  }

  create () {
    this.estados = [
      {
        [
          {texto, imagem}, {texto, imagem}
        ]




        texto: {
          x: 200,
          y: 250,
          conteudo: 'Ei, você!'
        },
        imagens: [
          {
          x: 100,
          y: 285,
          imagem: 'amy'
          },
          {
          x: 700,
          y: 290,
          imagem: 'georgina'
        }
      ]
      },
      {
        texto: {
          x: 200,
          y: 250,
          conteudo: 'Você, por aqui?!'
        },
        imagem:[ {
          x: 90,
          y: 285,
          nome: 'jake'
        }]
      }
    ]
    this.estadoAtual = -1

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

    this.add.sprite(400, 225, 'escola2')
      .setInteractive()
      .on('pointerdown', () => {
        // Chama o próximo estado
        this.proximoEstado()
      })

    // Inicia o primeiro estado
    this.proximoEstado()
  }

  update () {
  }

  proximoEstado () {
    // Se existe uma imagem ou texto, então destrói
    if (this.imagem) this.imagem.destroy()
    if (this.texto) this.texto.destroy()

    // Incrementa o estado atual para o próximo
    this.estadoAtual++

    // Se não existe o próximo estado, então muda de cena
    if (this.estadoAtual >= this.estados.length) {
      this.scene.start('cena3')
      return
    }

    // Cria a imagem e o texto do estado atual
    this.imagem = this.add.sprite(
      this.estados[this.estadoAtual].imagem.x,
      this.estados[this.estadoAtual].imagem.y,
      this.estados[this.estadoAtual].imagem.nome
    ).setScale(1.5)

// this.estados[this.estadoAtual].forEach()

    this.texto = this.add.text(
      this.estados[this.estadoAtual].texto.x,
      this.estados[this.estadoAtual].texto.y,
      this.estados[this.estadoAtual].texto.conteudo
    )

    // Inicia a animação da imagem
    this.imagem.anims.play(`${this.estados[this.estadoAtual].imagem.nome}-falando`)
  }
}
