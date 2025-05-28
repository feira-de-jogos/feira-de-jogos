import MultiplayerGame from "./MultiplayerGame";
import config from "./config";
import ProtooClient from "protoo-client";

export const game = new MultiplayerGame(config);

const peer = new ProtooClient.Peer(game.transport);

peer.on("open", () => {
  console.log(peer);
});
