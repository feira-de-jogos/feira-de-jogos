import { Game, Types } from "phaser";
import mqtt from "mqtt";

export default class MultiplayerGame extends Game {
  constructor(config: Types.Core.GameConfig) {
    super(config);

    let wsHost = window.location.host;
    if (wsHost.match("github.dev")) {
      const devHost = wsHost.split(".")[0].split("-");
      wsHost = `${devHost[0]}-${devHost[1]}-${devHost[2]}-8080.app.github.dev`;
    }

    const ws = new WebSocket(`wss://${wsHost}/ws`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    const mqttBroker = "em.sj.ifsc.edu.br";

    const mqttClient = mqtt.connect(
      `wss://${mqttBroker}/mqtt/`
    );

    mqttClient.on("connect", () => {
      mqttClient.subscribe("jogo-modelo/#", (err) => {
        if (!err) {
          mqttClient.publish("jogo-modelo/0", "Hello mqtt!");
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      console.log(message.toString());
    });
  }
}
