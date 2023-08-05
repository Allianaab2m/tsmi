export type ICustomEmoji = {
  id: string;
  category: string;
  aliases: string[];
  host: string | null;
  license: string | null;
};

export class CustomEmoji {
  constructor(private emoji: ICustomEmoji) {}

  get id(): string {
    return this.emoji.id;
  }

  get category(): string {
    return this.emoji.category;
  }

  get aliases(): string[] {
    return this.emoji.aliases;
  }

  get host(): string | null {
    return this.emoji.host;
  }

  get license(): string | null {
    return this.emoji.license;
  }
}
