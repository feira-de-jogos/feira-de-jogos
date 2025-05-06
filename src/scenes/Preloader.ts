import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
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
    this.load.image("struct", "struct.png");
    this.load.image("grass", "grass.png");
    this.load.image("player", "player.png");
    this.load.image("props", "props.png");
    this.load.image("wall", "wall.png");
    this.load.image("stone-ground", "stone-ground.png");
    this.load.image("plant", "plant.png");
    this.load.image("shadow-plant", "shadow-plant.png");
    this.load.image("shadow", "shadow.png");
  }

  create() {
    this.scene.start("Room");
  }
}
