import { Scene, GameObjects } from "phaser"

export class Abertura extends Scene {
  constructor() {
    super("Abertura")
  }

  preload() {
    this.load.image("fundo", "assets/abertura-fundo.png")
  }

  create() {
    this.add.image(400, 225, "fundo")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("Precarregamento")
      })
  }
}
