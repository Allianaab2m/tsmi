import HTTPClient from "./http";
import NoteManager from "./manager/note";
import UserManager from "./manager/user";
import ReactionManager from "./manager/reaction";
import TypedEventEmitter from "./eventemitter";
//import { WsReconnect } from "websocket-reconnect";
import ReconnectingWebSocket from "reconnecting-websocket";
import { WebSocketChannels, webSocketHandler } from "./websocket";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";
import { AnyNotification, MentionNotification } from "./models/notification";
import ws from "ws";

type ClientEventTypes = {
  ready: [me: Client];
  noteCreate: [note: INote, timeline: Omit<WebSocketChannels, "main">];
  notification: [notification: AnyNotification];
  mention: [note: INote];
  reply: [note: INote];
  renote: [note: INote];
  follow: [user: IUserLite];
  followed: [user: IUserLite];
  unfollow: [user: IUserLite];
  unreadNotification: [notification: AnyNotification];
  unreadMention: [notification: MentionNotification];
  readAllUnreadMentions: [];
  unreadSpecifiedNote: [note: INote];
  readAllUnreadSpecifiedNotes: [];
};

type ClientConfig = {
  host: string;
  token: string;
  channels: Array<WebSocketChannels>;
};

export default class Client extends TypedEventEmitter<ClientEventTypes> {
  public note: NoteManager;
  public user: UserManager;
  public reaction: ReactionManager;
  //public websocket: WsReconnect;
  public websocket: ReconnectingWebSocket;

  constructor(private config: ClientConfig) {
    super();
    const session = new HTTPClient(config.host, config.token);
    this.user = new UserManager(session, this);
    this.note = new NoteManager(session, this);
    this.reaction = new ReactionManager(session, this);
    // this.websocket = new WsReconnect({ reconnectDelay: 5000 });
    this.websocket = new ReconnectingWebSocket(
      `${this.config.host.replace("https", "wss")}?i=${this.config.token}`,
      [],
      {
        WebSocket: ws,
        minReconnectionDelay: 1000,
      },
    );
  }

  public login() {
    /* this.websocket.open(
      `${this.config.host.replace("https", "wss")}?i=${this.config.token}`,
    ); */
    let login = false;

    this.websocket.addEventListener("open", () => {
      if (!login) {
        this.emit("ready", this);
        login = true;
      }
      webSocketHandler(this.config.channels, this.websocket, this);
    });

    //webSocketHandler(this.config.channels, this.websocket, this);
  }
}
