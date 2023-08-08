import HTTPClient from "../http";
import Client from "../client";
import Endpoints from "../endpoints";

type Merge<T> = {
  [K in keyof T]: T[K];
};

type AbuseUserReportsRes = Merge<
  & Endpoints["admin/abuse-user-reports"]["res"][number]
  & { url: string; detail: string; reportNoteId: string }
>[];

const commentDistributer = (comment: string) => {
  const [url, , detail] = comment.split("\n"); // [Note: <URL>>, -----, <Detail>]
  return {
    url: url.substring(6), // Note: を除く
    detail,
    reportNoteId: url.split("/")[4],
  };
};

export default class AdminManager {
  constructor(
    public session: HTTPClient,
    public client: Client,
  ) {}

  public async checkReport({
    limit,
    reporterOrigin,
    targetUserOrigin,
  }: Pick<
    Endpoints["admin/abuse-user-reports"]["req"],
    "limit" | "reporterOrigin" | "targetUserOrigin"
  >): Promise<AbuseUserReportsRes> {
    const reports = await this.session.request("admin/abuse-user-reports", {
      limit,
      state: null,
      reporterOrigin,
      targetUserOrigin,
      forwarded: false,
    });

    return reports.filter((r) => r.resolved === false).map((r) => {
      const { url, detail, reportNoteId } = commentDistributer(r.comment);
      return { ...r, url, detail, reportNoteId };
    });
  }
}
