import { Game, Types } from "phaser";
import ProtooClient from "protoo-client";

export default class MultiplayerGame extends Game {
  constructor(config: Types.Core.GameConfig) {
    super(config);
  }

  transport = new ProtooClient.WebSocketTransport("ws://localhost:3000/");
}
