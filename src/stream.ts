// ref: https://github.com/misskey-dev/misskey/blob/develop/packages/misskey-js/src/streaming.ts
import ws from "ws";
import Client from "./client";
import TypedEventEmitter from "./eventemitter";
import ReconnectingWebsocket from "reconnecting-websocket";
import { AnyNotification, MentionNotification } from "./models/notification";
import { INote } from "./models/note";
import { IUserLite } from "./models/user";

export type WebSocketChannels =
  | "main"
  | "globalTimeline"
  | "homeTimeline"
  | "hybridTimeline"
  | "localTimeline";

type ChannelEvents = {
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

export function urlQuery(
  obj: Record<string, string | number | boolean | undefined>,
): string {
  const params = Object.entries(obj)
    .filter(([, v]) => Array.isArray(v) ? v.length : v !== undefined)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .reduce(
      (a, [k, v]) => (a[k] = v!, a),
      {} as Record<string, string | number | boolean>,
    );

  return Object.entries(params)
    .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
    .join("&");
}

type StreamEvents = {
  _connected_: [];
  _disconnected_: [];
};

export default class Stream extends TypedEventEmitter<StreamEvents> {
  private client: Client;
  private websocket: ReconnectingWebsocket;
  public state: "initializing" | "reconnecting" | "connected" = "initializing";
  private sharedConnectionPools: Pool[] = [];
  private sharedConnections: SharedConnection[] = [];
  private nonSharedConnections: NonSharedConnection[] = [];
  private idCounter = 0;

  public main: SharedConnection;
  public home: SharedConnection;
  public local: SharedConnection;
  public hybrid: SharedConnection;
  public global: SharedConnection;

  constructor(client: Client, host: string, token: string) {
    super();

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.send = this.send.bind(this);
    this.close = this.close.bind(this);

    this.useSharedConnection = this.useSharedConnection.bind(this);
    this.removeSharedConnection = this.removeSharedConnection.bind(this);
    this.removeSharedConnectionPool = this.removeSharedConnectionPool.bind(
      this,
    );
    this.disconnectToChannel = this.disconnectToChannel.bind(this);

    this.client = client;
    const query = urlQuery({
      i: token,
      _t: Date.now(),
    });

    const wsHost = host.replace("https://", "wss://");

    this.websocket = new ReconnectingWebsocket(
      `${wsHost}/streaming?${query}`,
      "",
      {
        minReconnectionDelay: 1,
        WebSocket: ws,
      },
    );

    this.main = this.useSharedConnection("main", "main");
    this.local = this.useSharedConnection("localTimeline", "local");
    this.hybrid = this.useSharedConnection("hybridTimeline", "hybrid");
    this.home = this.useSharedConnection("homeTimeline", "home");
    this.global = this.useSharedConnection("globalTimeline", "global");

    this.websocket.addEventListener("open", this.onOpen);
    this.websocket.addEventListener("close", this.onClose);
    this.websocket.addEventListener("message", this.onMessage);
  }

  private genId(): string {
    return (++this.idCounter).toString();
  }

  private useSharedConnection<C extends WebSocketChannels>(
    channel: C,
    name?: string,
  ): SharedConnection {
    let pool = this.sharedConnectionPools.find((p) => p.channel === channel);

    if (pool === undefined) {
      pool = new Pool(this, channel, this.genId());
      this.sharedConnectionPools.push(pool);
    }

    const connection = new SharedConnection(this, channel, pool, name);
    this.sharedConnections.push(connection);
    return connection;
  }

  public removeSharedConnection(connection: SharedConnection) {
    this.sharedConnections = this.sharedConnections.filter((c) =>
      c !== connection
    );
  }

  public removeSharedConnectionPool(pool: Pool) {
    this.sharedConnectionPools = this.sharedConnectionPools.filter((p) =>
      p !== pool
    );
  }

  public disconnectToChannel(connection: NonSharedConnection) {
    this.nonSharedConnections = this.nonSharedConnections.filter((c) =>
      c !== connection
    );
  }

  private onOpen() {
    const isReconnect = this.state === "reconnecting";

    this.state = "connected";
    this.emit("_connected_");
    if (isReconnect) {
      for (const p of this.sharedConnectionPools) p.connect();
      for (const c of this.nonSharedConnections) c.connect();
    } else {
      this.client.emit("ready", this.client);
    }
  }

  private onClose() {
    if (this.state === "connected") {
      this.state = "reconnecting";
      console.log("[WebSocket] Reconnecting.");
      this.emit("_disconnected_");
    }
  }

  private onMessage(message: { data: string }) {
    const { type, body } = JSON.parse(message.data);

    if (type === "channel") {
      const id = body.id;
      let connections: Connection[];
      connections = this.sharedConnections.filter((c) => c.id === id);
      if (connections.length === 0) {
        const found = this.nonSharedConnections.find((c) => c.id === id);
        if (found) {
          connections = [found];
        }
      }
      for (const c of connections) {
        if (body.type === "note") {
          switch (c.name) {
            case "home":
              this.client.emit("noteCreate", body.body, "homeTimeline");
              this.home.emit("noteCreate", body.body, "homeTimeline");
              break;
            case "local":
              this.client.emit("noteCreate", body.body, "localTimeline");
              this.local.emit("noteCreate", body.body, "localTimeline");
              break;
            case "hybrid":
              this.client.emit("noteCreate", body.body, "hybridTimeline");
              this.hybrid.emit("noteCreate", body.body, "hybridTimeline");
              break;
            case "global":
              this.client.emit("noteCreate", body.body, "globalTimeline");
              this.global.emit("noteCreate", body.body, "globalTimeline");
              break;
            default:
              break;
          }
        } else {
          this.client.emit(body.type, body.body);
        }
        c.emit(body.type, body, body);
        c.inCount++;
      }
    } else {
      if (type === "note") {
        this.emit(type, body);
      } else {
        this.emit(type, body);
      }
    }
  }

  public send(type: string, payload: Record<string, string>) {
    this.websocket.send(JSON.stringify({
      type,
      body: payload,
    }));
  }

  public ping(): void {
    this.websocket.send("ping");
  }

  public heartbeat(): void {
    this.websocket.send("h");
  }

  public close(): void {
    this.websocket.close();
  }
}

class Pool {
  public channel: string;
  public id: string;
  protected stream: Stream;
  public users = 0;
  private disposeTimerId: any;
  private isConnected = false;

  constructor(stream: Stream, channel: string, id: string) {
    this.onStreamDisconnected = this.onStreamDisconnected.bind(this);
    this.inc = this.inc.bind(this);
    this.dec = this.dec.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.connect.bind(this);

    this.channel = channel;
    this.stream = stream;
    this.id = id;

    this.stream.on("_disconnected_", this.onStreamDisconnected);
  }

  private onStreamDisconnected(): void {
    this.isConnected = false;
  }

  public inc(): void {
    if (this.users === 0 && !this.isConnected) {
      this.connect();
    }

    this.users++;

    if (this.disposeTimerId) {
      clearTimeout(this.disposeTimerId);
      this.disposeTimerId = null;
    }
  }

  public dec(): void {
    this.users--;
    if (this.users === 0) {
      this.disposeTimerId = setTimeout(() => {
        this.disconnect();
      }, 3000);
    }
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.stream.send("connect", {
      channel: this.channel,
      id: this.id,
    });
  }

  public disconnect(): void {
    this.stream.off("_disconnected_", this.onStreamDisconnected);
    this.stream.send("disconnect", { id: this.id });
    this.stream.removeSharedConnectionPool(this);
  }
}

export abstract class Connection extends TypedEventEmitter<ChannelEvents> {
  public channel: string;
  protected stream: Stream;
  public abstract id: string;

  public name?: string;
  public inCount = 0;
  public outCount = 0;

  constructor(stream: Stream, channel: string, name?: string) {
    super();

    this.send = this.send.bind(this);
    this.stream = stream;
    this.channel = channel, this.name = name;
  }

  public send() {
    this.stream.send("ch", {
      id: this.id,
    });
  }

  public abstract dispose(): void;
}

class SharedConnection extends Connection {
  private pool: Pool;
  public get id(): string {
    return this.pool.id;
  }

  constructor(stream: Stream, channel: string, pool: Pool, name?: string) {
    super(stream, channel, name);
    this.dispose = this.dispose.bind(this);
    this.pool = pool;
    this.pool.inc();
  }

  public dispose(): void {
    this.pool.dec();
    this.removeAllListeners();
    this.stream.removeSharedConnection(this);
  }
}

class NonSharedConnection extends Connection {
  public id: string;

  constructor(stream: Stream, channel: string, id: string) {
    super(stream, channel);
    this.connect = this.connect.bind(this);
    this.dispose = this.dispose.bind(this);

    this.id = id;
    this.connect();
  }

  public connect(): void {
    this.stream.send("connect", {
      channel: this.channel,
      id: this.id,
    });
  }

  public dispose(): void {
    this.removeAllListeners();
    this.stream.send("disconnect", { id: this.id });
    this.stream.disconnectToChannel(this);
  }
}
