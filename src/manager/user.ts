import Endpoints from "../endpoints";
import HTTPClient from "../http";
import { Note } from "../models/note";
import { IUserLite, UserDetailed } from "../models/user";
import objFalsyValueRemove from "../utils/objFalsyValueRemove";
import Client from "../client";

export default class UserManager {
  constructor(
    private session: HTTPClient,
    private client: Client,
    private user?: IUserLite,
  ) {}

  public async getMe(): Promise<UserDetailed> {
    const res = await this.session.request("i", {});
    return new UserDetailed(res, this.client);
  }

  public async get({
    userId = null,
    username = null,
    host = null,
  }: Partial<Endpoints["users/show"]["req"]>): Promise<UserDetailed> {
    const opts = objFalsyValueRemove(
      {
        userId,
        username,
        host,
      },
      [null],
    );
    const res = await this.session.request("users/show", {
      userId: opts.userId,
      username: opts.username,
      host: opts.host,
    });
    return new UserDetailed(res, this.client);
  }

  public async getNotes({
    userId,
    includeReplies = true,
    limit = 10,
    sinceId = null,
    untilId = null,
    sinceDate = 0,
    untilDate = 0,
    includeMyRenotes = false,
    withFiles = false,
    fileType = undefined,
    excludeNsfw = false,
  }: Pick<Endpoints["users/notes"]["req"], "userId"> &
    Partial<Omit<Endpoints["users/notes"]["req"], "userId">>): Promise<Note[]> {
    const opts = objFalsyValueRemove(
      {
        userId,
        includeReplies,
        limit,
        sinceId,
        untilId,
        sinceDate,
        untilDate,
        includeMyRenotes,
        withFiles,
        fileType,
        excludeNsfw,
      },
      [null, 0],
    );
    const res = await this.session.request("users/notes", {
      userId: opts.userId,
      includeReplies: opts.includeReplies,
      limit: opts.limit,
      sinceId: opts.sinceId,
      untilId: opts.untilId,
      sinceDate: opts.sinceDate,
      untilDate: opts.untilDate,
      includeMyRenotes: opts.includeMyRenotes,
      withFiles: opts.withFiles,
      fileType: opts.fileType,
      excludeNsfw: opts.excludeNsfw,
    });

    return res.map((note) => new Note(note, this.client));
  }
}
