import { INote } from "./note";
import { IUserLite } from "./user";

type NotificationType = "follow" | "mention" | "achievementEarned";

interface BaseNotification {
  id: string;
  createdAt: string;
  type: NotificationType;
}

export type MentionNotification = BaseNotification & {
  type: "mention";
  userId: string;
  user: IUserLite;
  note: INote;
};

export type FollowNotification = BaseNotification & {
  type: "follow";
  userId: string;
  user: IUserLite;
};

export type AchievementEarnedNotification = BaseNotification & {
  type: "achievementEarned";
  achievement: string;
};

export type AnyNotification =
  | MentionNotification
  | FollowNotification
  | AchievementEarnedNotification;
