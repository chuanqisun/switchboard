import { AuthService } from "../auth/auth.service";

export class GraphService {
  constructor() {}

  async get(endpoint: string, token: string) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers,
    };

    console.log("request made to Graph API at: " + new Date().toString());

    return fetch(endpoint, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
}
