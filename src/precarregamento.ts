import { Scene } from "phaser";

export class Precarregamento extends Scene {
  constructor() {
    super("Precarregamento");
  }

  init() {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);
    this.load.on("progress", (progress: number) => {
      progresso.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("estruturas", "estruturas.png");
    this.load.image("grama", "grama.png");
    this.load.image("jogador", "jogador.png");
    this.load.image("objetos", "objetos.png");
    this.load.image("paredes", "paredes.png");
    this.load.image("pedras", "pedras.png");
    this.load.image("plantas", "plantas.png");
    this.load.image("sombras-plantas", "sombras-plantas.png");
    this.load.image("sombras", "sombras.png");
  }

  create() {
    this.scene.start("Principal");
  }
}
