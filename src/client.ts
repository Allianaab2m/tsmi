import HTTPClient from "./http";
import NoteManager from "./manager/note";
import UserManager from "./manager/user";
import ReactionManager from "./manager/reaction";
import TypedEventEmitter from "./eventemitter";
import Stream from "./stream";
import { WebSocketChannels } from "./stream";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";
import { AnyNotification, MentionNotification } from "./models/notification";

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
};

export default class Client extends TypedEventEmitter<ClientEventTypes> {
  public note: NoteManager;
  public user: UserManager;
  public reaction: ReactionManager;
  public stream: Stream;

  constructor(private config: ClientConfig) {
    super();
    const session = new HTTPClient(this.config.host, this.config.token);
    this.user = new UserManager(session, this);
    this.note = new NoteManager(session, this);
    this.reaction = new ReactionManager(session, this);
    // this.websocket = new WsReconnect({ reconnectDelay: 5000 });
    this.stream = new Stream(this, this.config.host, this.config.token);
  }
}
