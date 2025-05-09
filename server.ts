import { WebSocket, WebSocketServer } from "ws";
import { EventData } from "./src/interfaces";

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
