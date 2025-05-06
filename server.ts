import { WebSocket, WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on("connection", (ws: WebSocket) => {
  ws.send(`Welcome to server!`);

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => console.error(error));
});
