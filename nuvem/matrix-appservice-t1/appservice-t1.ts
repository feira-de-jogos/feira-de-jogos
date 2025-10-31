import { AppService } from "matrix-appservice";
import { config } from "dotenv";

config();
const appserviceHostname =
  process.env.APPSERVICE_NAME || "matrix-appservice-t1";
const appservicePort = parseInt(process.env.APPSERVICE_PORT || "3000");
// const asToken = process.env.AS_TOKEN || "***"
const hsToken = process.env.HS_TOKEN || "***";
const backlogSize = parseInt(process.env.BACKLOG_SIZE || "0");

const as = new AppService({
  homeserverToken: hsToken,
});

as.on("type:m.room.message", (event) => {
  console.log("RECV %s", JSON.stringify(event));
});

as.listen(appservicePort, appserviceHostname, backlogSize)!
  .then(() => {
    console.log("Listening on port %s", appservicePort);
  })
  .catch((err) => {
    console.error("Error starting appservice: %s", err);
  });
