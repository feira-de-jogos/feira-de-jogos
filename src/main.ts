import { Game, Types } from "phaser";
import { Abertura } from "./abertura";
import { Precarregamento } from "./precarregamento";
import { Principal } from "./principal";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: "game-container",
  dom: {
    createContainer: true,
  },
  input: {
    gamepad: true,
    touch: {
      target: "game-container",
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Principal, Abertura, Precarregamento],
};

export default new Game(config);
