import type { WsReconnect } from "websocket-reconnect";
import { v4 as uuidv4 } from "uuid";
import Client from "./client";
import { INote } from "./models/note";

export type WebSocketChannels =
  | "main"
  | "globalTimeline"
  | "homeTimeline"
  | "hybridTimeline"
  | "localTimeline";

export const webSocketHandler = (
  channels: Array<WebSocketChannels>,
  ws: WsReconnect,
  client: Client,
) => {
  channels.forEach((c) => {
    ws.send(
      JSON.stringify({
        type: "connect",
        body: {
          channel: c,
          id: c,
        },
      }),
    );
  });
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.body.type === "note") {
      client.emit("noteCreate", message.body.body as INote, message.body.id);
    }
  });
};
