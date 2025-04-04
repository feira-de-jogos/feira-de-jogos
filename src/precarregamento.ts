import { Scene } from "phaser"

export class Precarregamento extends Scene {

  constructor () {
    super("Precarregamento")
  }

  init() {
    this.add.image(400, 225, "fundo")

    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff)
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff)
    this.load.on('progress', (progress: number) => {
      progresso.width = 4 + (460 * progress)
    })
  }

  preload () {
    this.load.setPath("assets/")
    this.load.image("fundo", "abertura-fundo.png")
    this.load.audio("pop", "pop.mp3")
    this.load.audio("musica-espaco", "musica-espaco.mp3")
  }

  create () {
    this.scene.start("Principal")
  }
}
