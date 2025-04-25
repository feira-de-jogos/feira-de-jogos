import { Scene } from "phaser";

export class Abertura extends Scene {
  constructor() {
    super("Abertura");
  }

  create() {
    this.scene.start("Precarregamento");
  }
}
