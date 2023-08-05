import HTTPClient from "./http";
import NoteManager from "./manager/note";
import UserManager from "./manager/user";
import ReactionManager from "./manager/reaction";
import TypedEventEmitter from "./eventemitter";
import { WsReconnect } from "websocket-reconnect";
import { WebSocketChannels, webSocketHandler } from "./websocket";
import { INote } from "./models/note";

type ClientEventTypes = {
  ready: [me: Client];
  noteCreate: [note: INote, timeline: Omit<WebSocketChannels, "main">];
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
  public websocket: WsReconnect;

  constructor(private config: ClientConfig) {
    super();
    const session = new HTTPClient(config.host, config.token);
    this.user = new UserManager(session, this);
    this.note = new NoteManager(session, this);
    this.reaction = new ReactionManager(session, this);
    this.websocket = new WsReconnect({ reconnectDelay: 5000 });
  }

  public login() {
    this.websocket.open(
      `${this.config.host.replace("https", "wss")}?i=${this.config.token}`,
    );

    this.websocket.on("open", () => {
      this.emit("ready", this);
    });

    webSocketHandler(this.config.channels, this.websocket, this);
  }
}
