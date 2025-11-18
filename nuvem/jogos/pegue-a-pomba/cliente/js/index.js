/*global Phaser, io*/
/*eslint no-undef: "error"*/
import config from "./config.js";
import abertura from "./abertura.js";
import precarregamento from "./precarregamento.js";
import fase from "./fase.js";
import gameover from "./gameover.js";
import finalfeliz from "./finalfeliz.js";
import sala from "./sala.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.audio = document.querySelector("audio");
    let iceServers;
    if (window.location.host === "feira-de-jogos.dev.br") {
      this.socket = io({ path: "/api/v2/game/" });
      iceServers = [
        {
          urls: "turns:feira-de-jogos.dev.br",
          username: "adcipt20251",
          credential: "adcipt20251",
        },
      ];
    } else {
      this.socket = io();
      iceServers = [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ];
    }
    this.iceServers = { iceServers };

    this.socket.on("connect", () => {
      console.log(`Usuário ${this.socket.id} conectado no servidor`);
    });

    this.socket.on("proxima-fase", (dados) => {
      console.log("Próxima fase recebida:", dados);
      this.scene.stop(this.cenaAtual);
      this.scene.start(dados.fase, { score: dados.score });
    });

    this.scene.add("abertura", abertura);
    this.scene.add("precarregamento", precarregamento);
    this.scene.add("sala", sala);
    this.scene.add("fase", fase);
    this.scene.add("gameover", gameover);
    this.scene.add("finalfeliz", finalfeliz);

    this.scene.start("abertura");
  }
}

window.onload = () => {
  window.game = new Game();
};
