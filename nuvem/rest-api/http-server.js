const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authBearerParser = require("auth-bearer-parser").default;
const path = require("path");

const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const ioGame = new Server(httpServer, {
  path: "/api/v2/game/",
  cors: { origin: "*" },
});
const ioMachine = new Server(httpServer, {
  path: "/api/v2/machine/",
  cors: { origin: "*" },
});

app.use(
  cors({
    origin: /feira-de-jogos\.dev\.br$/,
    methods: "POST",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(authBearerParser());

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

app.use(
  "/admin",
  express.static(path.join(__dirname, "frontend", "administration"))
);
app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "administration", "index.html")
  );
});

const machinesStatus = new Map();

module.exports = { app, httpServer, ioGame, ioMachine, machinesStatus };
