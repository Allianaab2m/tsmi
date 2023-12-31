/**
 * Misskey endpoints
 */

import { IUserDetailed, IUserLite } from "./models/user";
import { INote, NoteVisibility, ReactionAcceptance } from "./models/note";

type NoParams = Record<string, never>;

export default interface Endpoints {
  ["notes/create"]: {
    req: {
      visibility: NoteVisibility;
      visibleUserIds: string[];
      cw: string | null;
      localOnly: boolean;
      reactionAcceptance: ReactionAcceptance | null;
      text: string | null;
      replyId: string | null;
      renoteId: string | null;
      poll: {
        choices: string[];
        multiple: boolean;
        expiresAt: number | null;
        expiredAfter: number | null;
      } | null;
    };
    res: {
      createdNote: INote;
    };
  };
  ["i"]: {
    req: NoParams;
    res: IUserDetailed;
  };
  ["users/show"]: {
    req: {
      userId: string | null;
      userIds?: string[];
      username: string | null;
      host: string | null;
    };
    res: IUserDetailed;
  };
  ["users/notes"]: {
    req: {
      userId: string;
      includeReplies: boolean;
      limit: number;
      sinceId: string | null;
      untilId: string | null;
      sinceDate: number;
      untilDate: number;
      includeMyRenotes: boolean;
      withFiles: boolean;
      fileType?: string[];
      excludeNsfw: boolean;
    };
    res: INote[];
  };

  ["notes/reactions"]: {
    req: {
      noteId: string;
      type: string | null;
      limit: number | null;
      offset: number;
      sinceId: string | null;
      untilId: string | null;
    };
    res: {
      id: string;
      createdAt: string;
      user: IUserLite;
      reaction: string;
    }[];
  };

  ["notes/reactions/create"]: {
    req: {
      noteId: string;
      reaction: string;
    };
    res: void;
  };

  ["notes/reactions/delete"]: {
    req: {
      noteId: string;
      reaction: string;
    };
    res: void;
  };

  ["following/create"]: {
    req: {
      userId: string;
    };
    res: IUserLite;
  };

  ["admin/abuse-user-reports"]: {
    req: {
      limit: number;
      state: string | null;
      reporterOrigin: "conbined" | "local" | "remote";
      targetUserOrigin: "conbined" | "local" | "remote";
      forwarded: boolean;
    };
    res: {
      id: string;
      createdAt: string;
      comment: string;
      resolved: boolean;
      reporterId: IUserLite["id"];
      targetUserId: IUserLite["id"];
      assigneeId: IUserLite["id"];
      reporter: IUserLite;
      targetUser: IUserLite;
    }[];
  };
}
