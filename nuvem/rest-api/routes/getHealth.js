const express = require("express");
const router = express.Router();
const { machinesStatus } = require("../http-server.js");

router.get("/health", (req, res) => {
  const status = [];

  for (const [id, info] of machinesStatus.entries()) {
    status.push({
      id,
      machine: info.machine,
      lastPing: info.lastPing,
      alive: Date.now() - info.lastPing < 5000,
    });
  }

  res.json(status);
});

module.exports = router;
