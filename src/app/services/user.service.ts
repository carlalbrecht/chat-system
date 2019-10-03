import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";


/**
 * User permission levels.
 */
export const ROLES = [
  "user",
  "group_admin",
  "super_admin"
];


export interface UserAttributes {
  role: string;
  password: string;
  profile?: string;
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

  private attributePollingTask: ReturnType<typeof setInterval>;


  private profileUrlValue = "/assets/icons/account.svg";
  private profileUrlChanged: boolean = false;

  public get profileUrl(): string {
    return this.profileUrlValue;
  }

  public get profileUrlIsCustom(): boolean {
    return this.profileUrlChanged;
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


  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private HOST: string
  ) {
    // Request user attributes from server again if we are already logged in
    if (this.userdata.username !== null) {
      this.getUserAttributes();
      this.attributePollingTask = setInterval(this.getUserAttributes.bind(this), 15000);
    }
  }


  public async login(username: string, password: string): Promise<boolean> {
    // API response schema
    interface Response {
      authenticated: boolean;
    }

    try {
      // Submit authentication request
      let response = await this.http.post<Response>(`${this.HOST}/api/auth`, {
        username: username,
        password: password
      }).toPromise();

      if (response.authenticated) {
        // Authentication succeeded
        this.userdata.username = username;
        localStorage.setItem("username", username);

        await this.getUserAttributes();
        this.attributePollingTask = setInterval(this.getUserAttributes.bind(this), 15000);

        return true;
      } else {
        // Authentication failed - forcefully ensure that we're logged out
        this.logout();

        return false;
      }
    } catch (resp) {
      return false;
    }
  }


  public logout() {
    clearInterval(this.attributePollingTask);

    this.userdata.username = null;
    this.userdata.attributes = undefined;

    localStorage.removeItem("username");
  }


  /**
   * Returns whether or not the current user meets the minimum requirements to
   * perform an action.
   *
   * @param minimum The named role to meet or exceed
   * @throws If `minimum` does not name a valid role
   * @see ROLES
   */
  public hasPermission(minimum: string): boolean {
    // Skip if attributes aren't loaded yet
    if (this.userdata.attributes === undefined) return false;

    const minimumID = ROLES.indexOf(minimum);
    const roleID = ROLES.indexOf(this.userdata.attributes.role);

    if (minimumID < 0) throw new Error("Invalid minimum role name");

    return roleID >= minimumID;
  }


  public async setProfilePicture(imageID: string) {
    this.profileUrlValue = `${this.HOST}/media/${imageID}`;
    this.profileUrlChanged = true;

    await this.http.post<any>(
      `${this.HOST}/api/users/${this.userdata.username}/profile`,
      { media_id: imageID }
    ).toPromise();
  }


  private async getUserAttributes() {
    try {
      // Submit attributes request
      this.userdata.attributes = await this.http.get<UserAttributes>(
        `${this.HOST}/api/users/${this.userdata.username}/attributes`
      ).toPromise();

      if (this.userdata.attributes.hasOwnProperty("profile")) {
        // User already has a profile picture set
        const imageID = this.userdata.attributes.profile;

        this.profileUrlValue = `${this.HOST}/media/${imageID}`;
        this.profileUrlChanged = true;
      }
    } catch (resp) {
      return false;
    }
  }

}
