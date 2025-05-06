import { MqttClient } from "mqtt";
import { Scene } from "phaser";

export class Room extends Scene {
  constructor() {
    super("Room");
  }

  create() {
    const ws: WebSocket = this.sys.game.getWebSocket();
    ws.send("Hello from the Room scene!");

    const mqttClient: MqttClient = this.sys.game.getMqttClient();
    mqttClient.publish("jogo-modelo/Room", "In the room scene!");
  }
}
