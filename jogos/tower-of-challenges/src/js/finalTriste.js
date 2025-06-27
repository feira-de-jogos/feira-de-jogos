import Phaser from "phaser";

export default class finalTriste extends Phaser.Scene {
  constructor() {
    super("finalTriste");
  }

  preload() {
    this.load.image("finalTriste", "./assets/finalTriste.png");
  }

  create() {
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.image(400, 375, "finalTriste");
    this.add
      .text(120, 50, "Jogue Novamente Clicando Aqui", {
        fontSize: "32px",
        fill: "#fff",
        fontFamily: "Courier New",
      })
      .setInteractive()
      .on("pointerdown", () => {
        window.location.reload();
      });
  }
}
