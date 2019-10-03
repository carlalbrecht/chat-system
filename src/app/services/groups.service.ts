import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { UserService } from './user.service';


export interface Group {
  name: string,
  members: string[],
  assistants: string[],
  channels: any;  // TODO type
}

export interface GroupList {
  [groupID: string]: Group;
}


@Injectable({
  providedIn: "root"
})
export class GroupsService {

  constructor(
    private http: HttpClient,
    private user: UserService,
    @Inject("BASE_URL") private HOST: string
  ) { }


  public async getGroups(): Promise<GroupList> {
    try {
      return await
        this.http.get<GroupList>(`${this.HOST}/api/users/${this.user.name}/groups`).toPromise();
    } catch {
      return {};
    }
  }


  public async createGroup(name: string): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(`${this.HOST}/api/groups/create`, {
        name: name,
        creator: this.user.name
      }).toPromise()).success;
    } catch {
      return false;
    }
  }


  public async removeGroup(groupID: string): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.delete<Response>(`${this.HOST}/api/groups/${groupID}`).toPromise()).success;
    } catch {
      return false;
    }
  }


  public async setAssistants(groupID: string, assistants: string[]) {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(`${this.HOST}/api/groups/${groupID}/assistants`, {
        assistants: assistants
      }).toPromise()).success;
    } catch {
      return false;
    }
  }

}
