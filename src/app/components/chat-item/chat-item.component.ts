import { Component, Input, Inject, OnInit } from "@angular/core";

import { ChatEvent } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "chat-item",
  templateUrl: "./chat-item.component.html",
  styleUrls: ["./chat-item.component.scss"]
})
export class ChatItemComponent implements OnInit {

  // Cached profile picture URL IDs
  public static profileCache = {};

  public get profileCache() {
    return ChatItemComponent.profileCache;
  }


  @Input() chatEvent: ChatEvent;

  public get mediaUrl(): string {
    return `${this.ROOT}/media/${this.chatEvent.message}`;
  }


  constructor(
    private user: UserService,
    @Inject("BASE_URL") private ROOT: string
  ) { }


  public async ngOnInit() {
    // Fetch posting user's profile picture URL
    if (!ChatItemComponent.profileCache.hasOwnProperty(this.chatEvent.from)) {
      const mediaID = await this.user.getProfilePicture(this.chatEvent.from);

      ChatItemComponent.profileCache[this.chatEvent.from] =
        mediaID === null ? "/assets/icons/account.svg" : `${this.ROOT}/media/${mediaID}`;

      console.log(ChatItemComponent.profileCache);
    }
  }

}
