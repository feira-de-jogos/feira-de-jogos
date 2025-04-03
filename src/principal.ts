import { Scene, Physics } from "phaser"

export class Principal extends Scene {
  alien: Physics.Arcade.Sprite
  alienParado: boolean = true

  constructor () {
    super("Principal")

  }

  preload () {
    this.load.image("fundo", "assets/abertura-fundo.png")
    this.load.spritesheet("alien", "assets/alien.png", {
      frameWidth: 64,
      frameHeight: 64,
    })
  }

  create () {
    this.add.image(400, 225, "fundo")

    this.anims.create({
      key: "alien-parado",
      frames: this.anims.generateFrameNumbers("alien", { start: 0, end: 0 }),
      frameRate: 1
    })

    this.anims.create({
      key: "alien-andando",
      frames: this.anims.generateFrameNumbers("alien", { start: 1, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    this.alien = this.physics.add.sprite(100, 225, "alien")
      .setInteractive()
      .on("pointerdown", () => {
        if (this.alienParado) {
          this.alien.anims.play("alien-andando")
          this.alien.setVelocityX(100)
        } else {
          this.alien.anims.play("alien-parado")
          this.alien.setVelocityX(0)
        }
        this.alienParado = !this.alienParado
      })
  }
}
