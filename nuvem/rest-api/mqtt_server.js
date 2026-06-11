const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  clientId: process.env.MQTT_CLIENT_ID,
});

client.on("connect", () => {
  console.log("MQTT conectado");

  client.subscribe(process.env.MQTT_TOPIC_STATUS);
});

client.on("error", (err) => {
  console.error("MQTT erro:", err);
});

module.exports = client;