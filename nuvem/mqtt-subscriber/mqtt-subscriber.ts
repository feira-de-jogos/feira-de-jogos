import * as dotenv from "dotenv";
import * as mqtt from "mqtt";
import { InfluxDB } from "@influxdata/influxdb-client";

dotenv.config();
const MQTT_BROKER_URL =
  process.env.MQTT_BROKER_URL || "mqtt://mqtt-broker:1883";
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID || "mqtt-subscriber";
const MQTT_TOPIC = process.env.MQTT_TOPIC || "em/#";
const INFLUXDB_URL = process.env.INFLUXDB_URL || "http://tsdb:8086";
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN || "";
const INFLUXDB_ORG = process.env.INFLUXDB_ORG || "feira";
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET || "feira";

class MQTTToInfluxBridge {
  private mqttClient!: mqtt.MqttClient;
  private influxDB!: InfluxDB;
  private isConnected = false;

  constructor() {
    this.initializeInfluxDB();
    this.initializeMQTT();
  }

  private async initializeInfluxDB(): Promise<void> {
    try {
      this.influxDB = new InfluxDB({
        url: INFLUXDB_URL,
        token: INFLUXDB_TOKEN,
      });
      console.log("InfluxDB client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize InfluxDB:", error);
      setTimeout(() => this.initializeInfluxDB(), 10000);
    }
  }

  private initializeMQTT(): void {
    this.mqttClient = mqtt.connect(MQTT_BROKER_URL, {
      clientId: MQTT_CLIENT_ID,
      reconnectPeriod: 5000,
      keepalive: 60,
    });

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.isConnected = true;

      this.mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${MQTT_TOPIC}:`, err);
        } else {
          console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        }
      });
    });

    this.mqttClient.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      this.writeToInfluxDB(message.toString());
    });

    this.mqttClient.on("error", (error) => {
      console.error("MQTT connection error:", error);
      this.isConnected = false;
    });

    this.mqttClient.on("close", () => {
      console.log("MQTT connection closed");
      this.isConnected = false;
    });

    this.mqttClient.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker...");
    });
  }

  private async writeToInfluxDB(payload: string): Promise<void> {
    try {
      const writeApi = this.influxDB.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET);

      writeApi.writeRecord(payload);
      await writeApi.flush();

      console.log(`Data written to InfluxDB: ${payload}`);
    } catch (error) {
      console.error("Error writing to InfluxDB:", error);
    }
  }

  public getStatus(): { mqtt: boolean; influx: boolean } {
    return {
      mqtt: this.isConnected,
      influx: !!INFLUXDB_TOKEN,
    };
  }

  public async close(): Promise<void> {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
    if (this.influxDB) {
      console.log("Closing InfluxDB connections...");
    }
  }
}

const bridge = new MQTTToInfluxBridge();

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await bridge.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await bridge.close();
  process.exit(0);
});

process.on("SIGUSR1", () => {
  const status = bridge.getStatus();
  console.log("Bridge status:", status);
});

console.log("MQTT to InfluxDB bridge started");
