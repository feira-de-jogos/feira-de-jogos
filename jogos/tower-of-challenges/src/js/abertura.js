import Phaser from "phaser";

export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("play", "./assets/play.png");
  }

  create() {
    this.add
      .image(400, 375, "play")
      .setInteractive()
      .on("pointerdown", () => {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream;
          })
          .catch((error) => console.error(error));
        this.game.scene.stop("abertura");
        this.game.scene.start("sala");
      });
  }
}
