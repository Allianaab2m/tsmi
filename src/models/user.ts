import Client from "../client";
import { INote } from "./note";

type Instance = any;
type IPage = any;

export type IUserLite = {
  id: string;
  username: string;
  host: string | null;
  name: string;
  onlineStatus: "online" | "active" | "offline" | "unknown";
  avatarUrl: string;
  avatarBlurhash: string;
  emojis: {
    name: string;
    url: string;
  }[];
  instance?: {
    name: Instance["name"];
    softwareName: Instance["softwareName"];
    softwareVersion: Instance["softwareVersion"];
    iconUrl: Instance["iconUrl"];
    faviconUrl: Instance["faviconUrl"];
    themeColor: Instance["themeColor"];
  };
  isBot: boolean
  isCat: boolean
};

export type IUserDetailed = IUserLite & {
  alsoKnownAs: string[];
  bannerBlurhash: string | null;
  bannerColor: string | null;
  bannerUrl: string | null;
  birthday: string | null;
  createdAt: string;
  description: string | null;
  ffVisibility: "public" | "followers" | "private";
  fields: { name: string; value: string }[];
  followersCount: number;
  followingCount: number;
  hasPendingFollowRequestFromYou: boolean;
  hasPendingFollowRequestToYou: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  isFollowed: boolean;
  isFollowing: boolean;
  isLocked: boolean;
  isModerator: boolean;
  isMuted: boolean;
  isSilenced: boolean;
  isSuspended: boolean;
  lang: string | null;
  lastFetchedAt?: string;
  location: string | null;
  movedTo: string;
  notesCount: number;
  pinnedNoteIds: string[];
  pinnedNotes: INote[];
  pinnedPage: IPage | null;
  pinnedPageId: string | null;
  publicReactions: boolean;
  securityKeys: boolean;
  twoFactorEnabled: boolean;
  updatedAt: string | null;
  uri: string | null;
  url: string | null;
};

export class UserLite {
  constructor(
    private user: IUserLite,
    private client: Client,
  ) {}

  get id(): string {
    return this.user.id;
  }

  get username(): string {
    return this.user.username;
  }

  get host(): string | null {
    return this.user.host;
  }

  get name(): string {
    return this.user.name;
  }

  get onlineStatus(): "online" | "active" | "offline" | "unknown" {
    return this.user.onlineStatus;
  }

  get avatarUrl(): string {
    return this.user.avatarUrl;
  }

  get avatarBlurhash(): string {
    return this.user.avatarBlurhash;
  }

  get emojis(): {
    name: string;
    url: string;
  }[] {
    return this.user.emojis;
  }

  get instance(): {
    name: Instance["name"];
    softwareName: Instance["softwareName"];
    softwareVersion: Instance["softwareVersion"];
    iconUrl: Instance["iconUrl"];
    faviconUrl: Instance["faviconUrl"];
    themeColor: Instance["themeColor"];
  } | null {
    if (!this.user.instance) return null;
    return this.user.instance;
  }

  get isBot(): boolean {
    return this.isBot
  }

  get isCat(): boolean {
    return this.isCat
  }
}

export class UserDetailed {
  constructor(
    private user: IUserDetailed,
    private client: Client,
  ) {}

  get id(): string {
    return this.user.id;
  }
  get username(): string {
    return this.user.username;
  }
  get host(): string | null {
    return this.user.host;
  }
  get name(): string {
    return this.user.name;
  }
  get onlineStatus(): "online" | "active" | "offline" | "unknown" {
    return this.user.onlineStatus;
  }
  get avatarUrl(): string {
    return this.user.avatarUrl;
  }
  get avatarBlurhash(): string {
    return this.user.avatarBlurhash;
  }
  get emojis(): { name: string; url: string }[] {
    return this.user.emojis;
  }
  get instance(): {
    name: Instance["name"];
    softwareName: Instance["softwareName"];
    softwareVersion: Instance["softwareVersion"];
    iconUrl: Instance["iconUrl"];
    faviconUrl: Instance["faviconUrl"];
    themeColor: Instance["themeColor"];
  } | null {
    if (!this.user.instance) return null;
    return this.user.instance;
  }
  get alsoKnownAs(): string[] {
    return this.user.alsoKnownAs;
  }
  get bannerBlurhash(): string | null {
    return this.user.bannerBlurhash;
  }
  get bannerColor(): string | null {
    return this.user.bannerColor;
  }
  get bannerUrl(): string | null {
    return this.user.bannerUrl;
  }
  get birthday(): string | null {
    return this.user.birthday;
  }
  get createdAt(): string {
    return this.user.createdAt;
  }
  get description(): string | null {
    return this.user.description;
  }
  get ffVisibility(): "public" | "followers" | "private" {
    return this.user.ffVisibility;
  }
  get fields(): { name: string; value: string }[] {
    return this.user.fields;
  }
  get followersCount(): number {
    return this.user.followersCount;
  }
  get followingCount(): number {
    return this.user.followingCount;
  }
  get hasPendingFollowRequestFromYou(): boolean {
    return this.user.hasPendingFollowRequestFromYou;
  }
  get hasPendingFollowRequestToYou(): boolean {
    return this.user.hasPendingFollowRequestToYou;
  }
  get isAdmin(): boolean {
    return this.user.isAdmin;
  }
  get isBlocked(): boolean {
    return this.user.isBlocked;
  }
  get isBlocking(): boolean {
    return this.user.isBlocking;
  }
  get isBot(): boolean {
    return this.user.isBot;
  }
  get isCat(): boolean {
    return this.user.isCat;
  }
  get isFollowed(): boolean {
    return this.user.isFollowed;
  }
  get isFollowing(): boolean {
    return this.user.isFollowing;
  }
  get isLocked(): boolean {
    return this.user.isLocked;
  }
  get isModerator(): boolean {
    return this.user.isModerator;
  }
  get isMuted(): boolean {
    return this.user.isMuted;
  }
  get isSilenced(): boolean {
    return this.user.isSilenced;
  }
  get isSuspended(): boolean {
    return this.user.isSuspended;
  }
  get lang(): string | null {
    return this.user.lang;
  }
  get lastFetchedAt(): string | null {
    if (!this.user.lastFetchedAt) return null;
    return this.user.lastFetchedAt;
  }
  get location(): string | null {
    return this.user.location;
  }
  get movedTo(): string {
    return this.user.movedTo;
  }
  get notesCount(): number {
    return this.user.notesCount;
  }
  get pinnedNoteIds(): string[] {
    return this.user.pinnedNoteIds;
  }
  get pinnedNotes(): INote[] {
    return this.user.pinnedNotes;
  }
  get pinnedPage(): IPage | null {
    return this.user.pinnedPage;
  }
  get pinnedPageId(): string | null {
    return this.user.pinnedPageId;
  }
  get publicReactions(): boolean {
    return this.user.publicReactions;
  }
  get securityKeys(): boolean {
    return this.user.securityKeys;
  }
  get twoFactorEnabled(): boolean {
    return this.user.twoFactorEnabled;
  }
  get updatedAt(): string | null {
    return this.user.updatedAt;
  }
  get uri(): string | null {
    return this.user.uri;
  }
  get url(): string | null {
    return this.user.url;
  }
}
