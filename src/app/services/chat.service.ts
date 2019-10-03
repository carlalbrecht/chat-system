import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import * as io from "socket.io-client";

import { UserService } from "./user.service";
import { MediaService } from "./media.service";


export enum ChatEventType {
  Message = "message",
  Media = "media"
}


export interface ChatEvent {
  type: ChatEventType,
  message: string,
  from?: string,

  data: {
    [key: string]: any;
  }
}


@Injectable({
  providedIn: "root"
})
export class ChatService {

  private currentGroup?: string;
  private currentChannel?: string;

  private socket;


  constructor(
    private http: HttpClient,
    private user: UserService,
    private media: MediaService,
    @Inject("BASE_URL") private HOST: string
  ) { }


  public connect() {
    this.socket = io(this.HOST);
  }


  public events(): Observable<ChatEvent> {
    return new Observable(observer => {
      this.socket.on("message", (data: string) => {
        const event: ChatEvent = JSON.parse(data);
        observer.next(event);
      });
    });
  }


  public changeChannel(groupID: string, channelID: string) {
    this.currentGroup = groupID;
    this.currentChannel = channelID;
  }


  public sendMessage(message: string) {

  }


  public async sendImage() {
    const mediaID: string = await this.media.selectAndUploadImage();
  }

}
