import HTTPClient from "../http";
import Client from "../client";
import Endpoints from "../endpoints";

export default class NoteManager {
  constructor(
    public session: HTTPClient,
    public client: Client,
  ) {}

  public async post({
    text = null,
    cw = null,
    visibility = "followers",
    visibleUserIds = [],
    localOnly = false,
    reactionAcceptance = "nonSensitiveOnly",
    poll = null,
  }: Omit<Endpoints["notes/create"]["req"], "replyId" | "renoteId">) {
    const { createdNote } = await this.session.request("notes/create", {
      text,
      cw,
      visibility,
      visibleUserIds,
      localOnly,
      reactionAcceptance,
      poll,
      replyId: null,
      renoteId: null,
    });
    return createdNote;
  }

  public async renote({
    renoteId,
    visibility = "followers",
    visibleUserIds = [],
    localOnly = false,
    reactionAcceptance = "nonSensitiveOnly",
  }: Pick<
    Endpoints["notes/create"]["req"],
    | "renoteId"
    | "visibility"
    | "visibleUserIds"
    | "localOnly"
    | "reactionAcceptance"
  >) {
    const { createdNote } = await this.session.request("notes/create", {
      text: null,
      cw: null,
      visibility,
      visibleUserIds,
      localOnly,
      reactionAcceptance,
      poll: null,
      replyId: null,
      renoteId,
    });

    return createdNote;
  }

  public async quoteRenote({
    text,
    cw = null,
    renoteId,
    visibility = "followers",
    visibleUserIds = [],
    localOnly = false,
    reactionAcceptance = "nonSensitiveOnly",
  }: Pick<
    Endpoints["notes/create"]["req"],
    | "text"
    | "cw"
    | "renoteId"
    | "visibility"
    | "visibleUserIds"
    | "localOnly"
    | "reactionAcceptance"
  >) {
    const { createdNote } = await this.session.request("notes/create", {
      text,
      cw,
      visibility,
      visibleUserIds,
      localOnly,
      poll: null,
      renoteId,
      reactionAcceptance,
      replyId: null,
    });

    return createdNote;
  }

  public async reply({
    text,
    cw = null,
    replyId,
    visibility,
    visibleUserIds,
    localOnly,
    reactionAcceptance,
  }: Pick<
    Endpoints["notes/create"]["req"],
    | "text"
    | "cw"
    | "replyId"
    | "visibility"
    | "visibleUserIds"
    | "localOnly"
    | "reactionAcceptance"
  >) {
    const { createdNote } = await this.session.request("notes/create", {
      text,
      cw,
      visibility,
      visibleUserIds,
      replyId,
      localOnly,
      reactionAcceptance,
      renoteId: null,
      poll: null,
    });

    return createdNote;
  }
}
