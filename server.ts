import mqtt from "mqtt";
import { WebSocket, WebSocketServer } from "ws";
import { EventData } from "./src/interfaces";

const mqttBroker = "feira-de-jogos.dev.br";
const mqttClient = mqtt.connect(`wss://${mqttBroker}/mqtt/`);

mqttClient.on("connect", () => {
  mqttClient.subscribe("jogo-modelo/#", (err) => {
    if (!err) {
      mqttClient.publish("jogo-modelo/Game", "Starting a new game...");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  const scene: string = message.toString();
  console.log(`Received message: ${scene} on topic: ${topic}`);
});

mqttClient.on("error", (error) => {
  console.error(error);
});

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on("connection", (ws: WebSocket) => {
  const msg: EventData = {
    game: "jogo-modelo",
    sender: "server",
    message: "Welcome to server!",
  };
  ws.send(JSON.stringify(msg));

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error: string) => {
    console.error(error);
  });
});
