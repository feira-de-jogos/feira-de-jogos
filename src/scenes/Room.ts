import { Scene } from "phaser";
import { EventData } from "../interfaces";

export class Room extends Scene {
  constructor() {
    super("Room");
  }

  create() {
    const ws: WebSocket = this.sys.game.getWebSocket();
    const msg: EventData = {
      game: "jogo-modelo",
      scene: "Room",
      sender: "player",
      message: "In the room scene!",
    };
    ws.send(JSON.stringify(msg));
  }
}
