import HTTPClient from "./http";
import NoteManager from "./manager/note";
import UserManager from "./manager/user";
import ReactionManager from "./manager/reaction";
import AdminManager from "./manager/admin";
import TypedEventEmitter from "./eventemitter";
import { WebSocketChannels } from "./websocket";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";
import { AnyNotification, MentionNotification } from "./models/notification";
import { webSocketInit } from "./websocket";

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
  reconnectInterval?: number; // ms
};

export default class Client extends TypedEventEmitter<ClientEventTypes> {
  public note: NoteManager;
  public user: UserManager;
  public reaction: ReactionManager;
  public admin: AdminManager;
  public loginState: boolean;

  constructor(private config: ClientConfig) {
    super();
    const session = new HTTPClient(this.config.host, this.config.token);
    this.user = new UserManager(session, this);
    this.note = new NoteManager(session, this);
    this.reaction = new ReactionManager(session, this);
    this.admin = new AdminManager(session, this);
    this.loginState = false;
  }

  public login() {
    const { host, token, channels, reconnectInterval } = this.config;
    webSocketInit(host, token, channels, this, { reconnectInterval });
  }
}
