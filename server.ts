import express from "express";
import http from "http";
const app = express();
const httpServer = http.createServer(app);
import ProtooServer from "protoo-server";
const server = new ProtooServer.WebSocketServer(httpServer);
const port = process.env.PORT || 3000;

server.on("connectionrequest", (info, accept, reject) => {
  try {
    const transport = accept();

    const room = new ProtooServer.Room();
    const peer = room.createPeer("sala-0", transport);
  } catch (error) {
    console.error(error);
    reject(403, "Forbidden");
  }
});

httpServer.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});
