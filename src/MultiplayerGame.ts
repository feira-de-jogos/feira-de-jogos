import { Game, Types } from "phaser";
import { EventData } from "./interfaces";

export default class MultiplayerGame extends Game {
  ws: WebSocket;

  constructor(config: Types.Core.GameConfig) {
    super(config);

    const host: string = window.location.hostname;
    let wsURL: string = "";
    if (host.match("github.dev")) {
      const devHost = host.split(".")[0].split("-");
      wsURL = `wss://${devHost[0]}-${devHost[1]}-${devHost[2]}-8080.app.github.dev/`;
    } else {
      wsURL = `ws://${host}:8080/`;
    }

    this.ws = new WebSocket(wsURL);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.ws.onmessage = (event: MessageEvent) => {
      console.log("Message received from server:", event);
      const data: EventData = JSON.parse(event.data);

      if (data.scene === "Room") {
        this.scene.start("Room");
      }
    };
  }

  public getWebSocket(): WebSocket {
    return this.ws;
  }
}
