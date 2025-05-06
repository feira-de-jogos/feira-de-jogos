import { Game, Types } from "phaser";
import mqtt from "mqtt";

export default class MultiplayerGame extends Game {
  ws: WebSocket;
  mqttClient: mqtt.MqttClient;

  constructor(config: Types.Core.GameConfig) {
    super(config);

    let wsURL = window.location.host;
    if (wsURL.match("github.dev")) {
      const devHost = wsURL.split(".")[0].split("-");
      wsURL = `wss://${devHost[0]}-${devHost[1]}-${devHost[2]}-8080.app.github.dev/`;
    } else {
      wsURL = `wss://${wsURL}/ws`;
    }

    this.ws = new WebSocket(wsURL);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    interface eventData {
      scene: string;
      message: string;
    }

    this.ws.onmessage = (event: MessageEvent) => {
      console.log("Message received from server:", event);
      const data: eventData = JSON.parse(event.data);
      const scene: string = data.scene;

      if (scene === "Room") {
        this.scene.start("Room");
      }
    };

    const mqttBroker = "em.sj.ifsc.edu.br";

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
