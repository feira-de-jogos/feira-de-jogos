import Phaser from "phaser";
export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("fundo", "./assets/Cenas/TeladeFundo.png");
  } // colocar após a barrinha o plano de fundo, lembrando que deve importa-lo para o assets

  create() {
    this.add
      .image(427, 240, "fundo")
      .setInteractive()
      .on("pointerdown", () => {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream;
          })
          .catch((error) => console.error(error));

        globalThis.game.scene.stop("abertura");
        globalThis.game.scene.start("sala");
      });
  }
}
