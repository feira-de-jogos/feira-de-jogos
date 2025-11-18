import { config } from "dotenv";
import { Axios } from "axios";
import { createHmac } from "crypto";

class BotRegistration {
  axiosClient = new Axios({
    baseURL: "https://matrix.feira-de-jogos.dev.br",
    timeout: 1000,
    headers: { "Content-Type": "application/json" },
  });

  async getNonce(resourcePath: string): Promise<string> {
    return this.axiosClient
      .get(resourcePath)
      .then((res) => {
        const data =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        return data.nonce as string;
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  generateMac(
    nonce: string,
    username: string,
    password: string,
    admin: string,
    sharedSecret: string
  ): string {
    const macString = [nonce, username, password, admin].join("\0");

    return createHmac("sha1", sharedSecret).update(macString).digest("hex");
  }

  async registerBot(
    resourcePath: string,
    nonce: string,
    username: string,
    displayname: string,
    botPassword: string,
    admin: string,
    sharedSecret: string
  ): Promise<string> {
    const registrationData = {
      nonce: nonce,
      username: username,
      displayname: displayname,
      password: botPassword,
      admin: admin,
      mac: this.generateMac(nonce, username, botPassword, admin, sharedSecret),
    };

    return this.axiosClient
      .post(resourcePath, JSON.stringify(registrationData))
      .then((res) => {
        return res.data as string;
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }
}

config();
const resourcePath = process.env.RESOURCE_PATH || "/_synapse/admin/v1/register";
const registrationSharedSecret = process.env.REGISTRATION_SHARED_SECRET || "";
const botUsername = process.env.BOT_USERNAME || "admin-bot-1";
const botDisplayname = process.env.BOT_DISPLAYNAME || "Nuvem Bot";
const botPassword = process.env.BOT_PASSWORD || "";
const botAdmin = process.env.BOT_ADMIN || "admin";
const client = new BotRegistration();

client
  .getNonce(resourcePath)
  .then((nonce) => {
    client
      .registerBot(
        resourcePath,
        nonce,
        botUsername,
        botDisplayname,
        botPassword,
        botAdmin,
        registrationSharedSecret
      )
      .then((data) => {
        console.log("Bot registered successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to register bot:", error);
      });
  })
  .catch((error) => {
    console.error("Failed to get nonce:", error);
  });
