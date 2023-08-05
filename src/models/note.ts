import Client from "../client";
import { IDriveFile } from "./drive";
import { IUserLite, UserLite } from "./user";

export type ReactionAcceptance = `${"likeOnly" | "nonSensitiveOnly"}${
  | ""
  | "ForRemote"}`;

export type NoteVisibility = "public" | "home" | "followers" | "specified";

export type INote = {
  id: string;
  createdAt: string;
  userId: string;
  user: IUserLite;
  text: string | null;
  cw: string | null;
  visibility: NoteVisibility;
  localOnly: boolean;
  reactionAcceptance: ReactionAcceptance;
  renoteCount: number;
  repliesCount: number;
  reactions: {
    [key: string]: number;
  };
  reactionEmojis: {
    [key: string]: string;
  };
  fileIds: string[];
  files: IDriveFile[];
  replyId: string | null;
  renoteId: string | null;
};

export class Note {
  constructor(
    private note: INote,
    private client: Client,
  ) {}

  get id(): string {
    return this.note.id;
  }

  get createdAt(): Date {
    return new Date(this.note.createdAt);
  }

  get userId(): string {
    return this.note.userId;
  }

  get user(): UserLite {
    return new UserLite(this.note.user, this.client);
  }

  get text(): string | null {
    return this.note.text;
  }

  get cw(): string | null {
    return this.note.cw;
  }

  get visibility(): NoteVisibility {
    return this.note.visibility;
  }

  get localOnly(): boolean {
    return this.note.localOnly;
  }

  get reactionAcceptance(): ReactionAcceptance {
    return this.note.reactionAcceptance;
  }

  get renoteCount(): number {
    return this.note.renoteCount;
  }

  get repliesCount(): number {
    return this.note.repliesCount;
  }

  get reactions(): {
    [key: string]: number;
  } {
    return this.note.reactions;
  }

  get reactionEmojis(): {
    [key: string]: string;
  } {
    return this.note.reactionEmojis;
  }

  get fileIds(): string[] {
    return this.note.fileIds;
  }

  get files(): IDriveFile[] {
    return this.note.files;
  }

  get replyId(): string | null {
    return this.note.replyId;
  }

  get renoteId(): string | null {
    return this.note.renoteId;
  }
}
