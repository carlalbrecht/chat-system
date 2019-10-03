import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { UserAttributes } from "./user.service";


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

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private HOST: string
  ) { }


  public async getList(): Promise<UserList> {
    try {
      // Submit user list request
      return await this.http.get<UserList>(`${this.HOST}/api/users/`).toPromise();
    } catch (resp) {
      return {};
    }
  }


  public async setList(list: UserList): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(`${this.HOST}/api/users/`, list).toPromise()).success;
    } catch (resp) {
      return false;
    }
  }

}
