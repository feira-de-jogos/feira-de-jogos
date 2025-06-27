import Phaser from "phaser";

export default class finalTriste extends Phaser.Scene {
  constructor() {
    super("finalTriste");
  }

  preload() {
    this.load.image("finaltriste", "./assets/finaltriste.png");
  }

  create() {
    this.add
      .image(400, 225, "finaltriste")
      .setInteractive()
      .on("pointerdown", () => {
        location.reload();
      });
  }
}
