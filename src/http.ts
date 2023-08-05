// HTTP request class for every manager using axios

import axios, { AxiosInstance } from "axios";
import Endpoints from "./endpoints";

export default class HTTPClient {
  /**
   *
   * @param host - base url of the Misskey server
   *  @param token - access token of the user
   */

  private client: AxiosInstance;

  constructor(
    private host: string,
    private token: string,
  ) {
    this.client = axios.create({
      baseURL: `${this.host}/api`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   *
   * @param endpoint - Misskey API endpoint {@link Endpoints}
   * @param requestParams - request params
   */
  public async request<
    E extends keyof Endpoints,
    P extends Endpoints[E]["req"],
  >(endpoint: E, requestParams: P): Promise<Endpoints[E]["res"]> {
    const response = await this.client.post<Endpoints[E]["res"]>(
      endpoint,
      JSON.stringify({ ...requestParams, i: this.token }),
    );
    return response.data;
  }
}
