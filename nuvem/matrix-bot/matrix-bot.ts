import * as sdk from "matrix-js-sdk";
import { config } from "dotenv";

config();
const baseURL = process.env.BASE_URL || "https://matrix.feira-de-jogos.dev.br";
const accessToken = process.env.ACCESS_TOKEN;
const userId = process.env.USER_ID;
const deviceId = process.env.DEVICE_ID;
const roomsToJoin = ["#feira:matrix.feira-de-jogos.dev.br"];

const client = sdk.createClient({
  baseUrl: baseURL,
  accessToken: accessToken,
  userId: userId,
  deviceId: deviceId,
});

client.on(sdk.RoomEvent.MyMembership, (room, membership) => {
  if (
    membership === sdk.KnownMembership.Invite &&
    roomsToJoin.includes(room.roomId)
  ) {
    client.joinRoom(room.roomId).then(function () {
      console.log("Auto-joined %s", room.roomId);
    });
  }
});

client.on(sdk.RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
  if (toStartOfTimeline) {
    return;
  }

  if (event.getType() !== "m.room.message") {
    return;
  }

  console.log(
    "(%s) %s :: %s",
    room?.name,
    event.getSender(),
    event.getContent().body
  );
});

await client.startClient({ initialSyncLimit: 10 });
