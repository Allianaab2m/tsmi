import Client from "../client";

export type IPartialReaction = {
  id: string;
  type: "reacted" | "unreacted";
  body: {
    reaction: string;
    emoji: {
      name: string;
      url: string;
    };
    userId: string;
  };
};

export class PartialReaction {
  constructor(
    private reaction: IPartialReaction,
    private client: Client,
  ) {}

  get id(): string {
    return this.reaction.id;
  }

  get type(): "reacted" | "unreacted" {
    return this.reaction.type;
  }

  get body(): {
    reaction: string;
    emoji: { name: string; url: string };
    userId: string;
  } {
    return this.reaction.body;
  }
}
