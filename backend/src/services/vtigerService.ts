import axios from "axios";
import crypto from "crypto";

export class VtigerService {
  private url: string;
  private username: string;
  private accessKey: string;
  private sessionId: string | null = null;

  constructor(url: string, username: string, accessKey: string) {
    this.url = url.endsWith("/") ? url.slice(0, -1) : url;
    this.username = username;
    this.accessKey = accessKey;
  }

  private async getChallenge() {
    const response = await axios.get(`${this.url}/webservice.php?operation=getchallenge&username=${this.username}`);
    if (response.data.success) {
      return response.data.result.token;
    }
    throw new Error("Failed to get challenge token");
  }

  public async login() {
    const token = await this.getChallenge();
    const accessKey = crypto.createHash("md5").update(token + this.accessKey).digest("hex");

    const params = new URLSearchParams();
    params.append("operation", "login");
    params.append("username", this.username);
    params.append("accessKey", accessKey);

    const response = await axios.post(`${this.url}/webservice.php`, params);
    if (response.data.success) {
      this.sessionId = response.data.result.sessionName;
      return true;
    }
    throw new Error("Vtiger login failed: " + JSON.stringify(response.data.error));
  }

  public async query(queryString: string) {
    if (!this.sessionId) await this.login();
    const response = await axios.get(`${this.url}/webservice.php?operation=query&sessionName=${this.sessionId}&query=${encodeURIComponent(queryString)}`);
    return response.data;
  }

  public async getTicket(ticketId: string) {
    if (!this.sessionId) await this.login();
    const response = await axios.get(`${this.url}/webservice.php?operation=retrieve&sessionName=${this.sessionId}&id=${ticketId}`);
    return response.data;
  }

  public async addComment(ticketId: string, comment: string) {
    if (!this.sessionId) await this.login();
    const element = {
      commentcontent: comment,
      related_to: ticketId
    };
    const params = new URLSearchParams();
    params.append('operation', 'create');
    params.append('sessionName', this.sessionId!);
    params.append('elementType', 'ModComments');
    params.append('element', JSON.stringify(element));

    const response = await axios.post(`${this.url}/webservice.php`, params);
    return response.data;
  }

  public async assignTicket(ticketId: string, userId: string) {
    if (!this.sessionId) await this.login();
    const element = {
      id: ticketId,
      assigned_user_id: userId
    };
    const params = new URLSearchParams();
    params.append('operation', 'revise');
    params.append('sessionName', this.sessionId!);
    params.append('element', JSON.stringify(element));

    const response = await axios.post(`${this.url}/webservice.php`, params);
    return response.data;
  }
}
