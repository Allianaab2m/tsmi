import type { WsReconnect } from "websocket-reconnect";
import Client from "./client";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";
import { AnyNotification, MentionNotification } from "./models/notification";

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

    (() => {
      switch (message.body.type) {
        case "note":
          return client.emit(
            "noteCreate",
            message.body.body as INote,
            message.body.id,
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
};
