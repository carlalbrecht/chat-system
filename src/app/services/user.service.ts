import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";


/**
 * Use the local web server for development (i.e. when the web server and
 * `ng serve` are running separately).
 */
const HOST: string = isDevMode() ? "//localhost:3000" : "";


export interface UserAttributes {
  role: string;
}

interface UserData {
  username: string | null;
  attributes: UserAttributes | undefined;
}


@Injectable({
  providedIn: "root"
})
export class UserService {

  private userdata: UserData = {
    username: localStorage.getItem("username"),
    attributes: undefined
  }


  public get authenticated(): boolean {
    return this.userdata.username !== null;
  }

  public get name(): string {
    if (this.userdata.username !== null) {
      return this.userdata.username;
    }

    throw Error("Not authenticated");
  }

  public get attributes(): UserAttributes {
    return this.userdata.attributes;
  }


  constructor(private http: HttpClient) {
    // Request user attributes from server again if we are already logged in
    if (this.userdata.username !== null) {
      this.getUserAttributes();
    }
  }


  public async login(username: string, password: string): Promise<boolean> {
    // API response schema
    interface Response {
      authenticated: boolean;
    }

    try {
      // Submit authentication request
      let response = await this.http.post<Response>(HOST + "/api/auth", {
        username: username,
        password: password
      }).toPromise();

      if (response.authenticated) {
        // Authentication succeeded
        this.userdata.username = username;
        localStorage.setItem("username", username);

        this.getUserAttributes();

        return true;
      } else {
        // Authentication failed - forcefully ensure that we're logged out
        this.userdata.username = null;
        this.userdata.attributes = undefined;

        localStorage.removeItem("username");

        return false;
      }
    } catch (resp) {
      return false;
    }
  }


  public logout() {
    this.userdata.username = null;
    this.userdata.attributes = undefined;

    localStorage.removeItem("username");
  }


  private async getUserAttributes() {

  }

}
