import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { UserService } from './user.service';


export interface Channel {
  name: string,
  members: string[],
  assistants: string[],
  channels: any;  // TODO type
}

export interface ChannelList {
  [channelID: string]: Channel;
}


@Injectable({
  providedIn: "root"
})
export class ChannelsService {

  constructor(
    private http: HttpClient,
    private user: UserService,
    @Inject("BASE_URL") private HOST: string
  ) { }


  public async getChannels(groupID: string): Promise<ChannelList> {
    try {
      return await
        this.http.get<ChannelList>(`${this.HOST}/api/groups/${groupID}/channels`).toPromise();
    } catch {
      return {};
    }
  }


  public async createChannel(groupID: string, name: string): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(`${this.HOST}/api/groups/${groupID}/channels/create`, {
        name: name
      }).toPromise()).success;
    } catch {
      return false;
    }
  }


  public async removeChannel(groupID: string, channelID: string): Promise<boolean> {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.delete<Response>(
        `${this.HOST}/api/groups/${groupID}/channels/${channelID}`
      ).toPromise()).success;
    } catch {
      return false;
    }
  }


  public async addUser(groupID: string, channelID: string, username: string) {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(
        `${this.HOST}/api/groups/${groupID}/channels/${channelID}/adduser`, {
        username: username
      }
      ).toPromise()).success;
    } catch {
      return false;
    }
  }


  public async removeUser(groupID: string, channelID: string, username: string) {
    interface Response {
      success: boolean;
    }

    try {
      return (await this.http.post<Response>(
        `${this.HOST}/api/groups/${groupID}/channels/${channelID}/removeuser`, {
        username: username
      }
      ).toPromise()).success;
    } catch {
      return false;
    }
  }

}
