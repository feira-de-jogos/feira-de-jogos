import { Game, Types } from "phaser";
import mqtt from "mqtt";

interface eventData {
  game: string;
  room?: string;
  scene?: string;
  sender: string;
  message: string;
}

export default class MultiplayerGame extends Game {
  ws: WebSocket;
  mqttClient: mqtt.MqttClient;

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
      const data: eventData = JSON.parse(event.data);
      const scene: string = data.scene;

      if (scene === "Room") {
        this.scene.start("Room");
      }
    };

    const mqttBroker = "feira-de-jogos.dev.br";

    this.mqttClient = mqtt.connect(`wss://${mqttBroker}/mqtt/`);

    this.mqttClient.on("connect", () => {
      this.mqttClient.subscribe("jogo-modelo/#", (err) => {
        if (!err) {
          this.mqttClient.publish("jogo-modelo/Game", "Starting a new game...");
        }
      });
    });

    this.mqttClient.on("message", (topic, message) => {
      const scene: string = message.toString();

      if (scene === "Room") {
        this.scene.start("Room");
      }
    });
  }

  public getWebSocket(): WebSocket {
    return this.ws;
  }

  public getMqttClient(): mqtt.MqttClient {
    return this.mqttClient;
  }
}
