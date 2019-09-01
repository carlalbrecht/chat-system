import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { UserAttributes } from "./user.service";


/**
 * Use the local web server for development (i.e. when the web server and
 * `ng serve` are running separately).
 */
const HOST: string = isDevMode() ? "//localhost:3000" : "";


/**
 * Mapping of usernames to user attributes.
 */
export interface UserRelationalMapping<T> {
  [username: string]: T
};

type UserList = UserRelationalMapping<UserAttributes>;


@Injectable({
  providedIn: "root"
})
export class UserListService {

  constructor(private http: HttpClient) { }


  public async getList(): Promise<UserList> {
    try {
      // Submit user list request
      return await this.http.get<UserList>(`${HOST}/api/users/`).toPromise();
    } catch (resp) {
      return {};
    }
  }


  public async setList(list: UserList): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(`${HOST}/api/users/`, list).toPromise()).success;
    } catch (resp) {
      return false;
    }
  }

}
