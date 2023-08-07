import Client from "./client";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";
import { AnyNotification, MentionNotification } from "./models/notification";
import ws from "ws";
import { v4 as uuidv4 } from "uuid";

export type WebSocketChannels =
  | "main"
  | "globalTimeline"
  | "homeTimeline"
  | "hybridTimeline"
  | "localTimeline";

export const webSocketInit = (
  host: string,
  token: string,
  channels: Array<WebSocketChannels>,
  client: Client,
  opts: { reconnectInterval?: number },
) => {
  const uuid = uuidv4();
  const reconnectInterval = opts.reconnectInterval ?? 120 * 1000;

  const websocket = new ws(
    `${host.replace("http", "ws")}/streaming?i=${token}`,
  );

  websocket.on("open", () => {
    if (client.loginState === false) {
      client.loginState = true;
      client.emit("ready", client);
    }
    channels.forEach((c) => {
      console.log("[WS] Connecting:", c);
      websocket.send(
        JSON.stringify({
          type: "connect",
          body: {
            channel: c,
            id: uuid + "-" + c,
          },
        }),
      );
    });
  });

  websocket.on("message", (data) => {
    const message = JSON.parse(data.toString());

    (() => {
      switch (message.body.type) {
        case "note":
          return client.emit(
            "noteCreate",
            message.body.body as INote,
            (message.body.id as string).substring(37),
          );
        case "notification":
          return client.emit(
            "notification",
            message.body.body as AnyNotification,
          );
        case "mention":
          return client.emit("mention", message.body.body as INote);
        case "reply":
          return client.emit("reply", message.body.body as INote);
        case "renote":
          return client.emit("renote", message.body.body as INote);
        case "follow":
          return client.emit("follow", message.body.body as IUserLite);
        case "followed":
          return client.emit("followed", message.body.body as IUserLite);
        case "unfollow":
          return client.emit("unfollow", message.body.body as IUserLite);
        case "unreadNotification":
          return client.emit(
            "unreadNotification",
            message.body.body as AnyNotification,
          );
        case "unreadMention":
          return client.emit(
            "unreadMention",
            message.body.body as MentionNotification,
          );
        case "unreadSpecifiedNote":
          return client.emit("unreadSpecifiedNote", message.body.body as INote);
        case "readAllUnreadSpecifiedNotes":
          return client.emit("unreadSpecifiedNote", message.body.body as INote);
        default:
          return console.log("debug", message);
      }
    })();
  });

  setInterval(() => {
    websocket.close();
  }, opts.reconnectInterval);

  websocket.on("close", () => {
    console.log("[WS] Connection closed. Reconnecting.");
    webSocketInit(host, token, channels, client, { reconnectInterval });
  });
};
