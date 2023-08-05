import Client from "../client";
import HTTPClient from "../http";
import Endpoints from "../endpoints";
import objFalsyValueRemove from "../utils/objFalsyValueRemove";

export default class ReactionManager {
  constructor(
    public session: HTTPClient,
    public client: Client,
  ) {}

  public async add(reaction: string, noteId: string) {
    await this.session.request("notes/reactions/create", {
      noteId,
      reaction,
    });
  }

  public async remove(reaction: string, noteId: string) {
    await this.session.request("notes/reactions/delete", {
      noteId,
      reaction,
    });
  }

  public async get({
    noteId,
    type,
    limit = 10,
    offset = 0,
    sinceId = null,
    untilId = null,
  }: Endpoints["notes/reactions"]["req"]) {
    const opts = objFalsyValueRemove(
      {
        noteId,
        type,
        limit,
        offset,
        sinceId,
        untilId,
      },
      [null, 0],
    );
    return await this.session.request("notes/reactions", {
      noteId: opts.noteId,
      type: opts.type,
      limit: opts.limit,
      offset: opts.offset,
      sinceId: opts.sinceId,
      untilId: opts.untilId,
    });
  }
}
