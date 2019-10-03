import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import * as io from "socket.io-client";

import { UserService } from "./user.service";
import { MediaService } from "./media.service";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


export enum ChatEventType {
  Message = "message",
  Media = "media"
}

export interface ChatEvent {
  type: ChatEventType,
  message: string,
  from: string,
  time: number,

  data?: {
    [key: string]: any;
  }
}


export enum ChannelChangeDirection {
  Joining = "joining",
  Leaving = "leaving"
}

export interface ChannelChangeEvent {
  name: string,
  group: string,
  channel: string,
  direction: ChannelChangeDirection
}


@Injectable({
  providedIn: "root"
})
export class ChatService {

  private currentGroup?: string;
  private currentChannel?: string;

  private socket;

  private notifying = false;


  constructor(
    private http: HttpClient,
    private user: UserService,
    private media: MediaService,
    @Inject("BASE_URL") private HOST: string
  ) {
    this.socket = io(this.HOST);
  }


  public events(): Observable<ChatEvent> {
    return new Observable(observer => {
      this.socket.on("chat event", (data: ChatEvent) => {
        observer.next(data);
      });
    });
  }


  public channelChanges(): Observable<ChannelChangeEvent> {
    return new Observable(observer => {
      this.socket.on("channel change", (data: ChannelChangeEvent) => {
        observer.next(data);
      });
    })
  }


  public async loadChannelHistory(): Promise<ChatEvent[]> {
    return await this.http.get<ChatEvent[]>(
      `${this.HOST}/api/groups/${this.currentGroup}/channels/${this.currentChannel}/history`)
      .toPromise();
  }


  public changeChannel(groupID: string, channelID: string) {
    if (this.currentGroup !== undefined && this.currentChannel !== undefined) {
      // Notify current channel that we're leaving, if we're already in one
      this.socket.emit("channel change", {
        name: this.user.name,
        group: this.currentGroup,
        channel: this.currentChannel,
        direction: ChannelChangeDirection.Leaving
      });
    }

    this.currentGroup = groupID;
    this.currentChannel = channelID;

    // Notify new channel that we're entering
    this.socket.emit("channel change", {
      name: this.user.name,
      group: this.currentGroup,
      channel: this.currentChannel,
      direction: ChannelChangeDirection.Joining
    });

    if (!this.notifying) {
      setInterval(() => {
        // Notify new channel that we're still here
        this.socket.emit("channel change", {
          name: this.user.name,
          group: this.currentGroup,
          channel: this.currentChannel,
          direction: ChannelChangeDirection.Joining
        });
      }, 1000);
    }
  }


  public sendMessage(message: string) {
    this.socket.emit("chat event", {
      type: ChatEventType.Message,
      message: message,
      from: this.user.name,
      time: new Date().getTime()
    });
  }


  public async sendImage() {
    const mediaID: string = await this.media.selectAndUploadImage();

    this.socket.emit("chat event", {
      type: ChatEventType.Media,
      message: mediaID,
      from: this.user.name,
      time: new Date().getTime()
    })
  }

}
