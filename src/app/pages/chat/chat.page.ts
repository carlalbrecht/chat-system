import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "page-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {

  public currentChannel: string = "the-current-channel";


  constructor(
    private router: Router,
    public user: UserService
  ) { }


  public dashboard() {
    this.router.navigate(["/dashboard"]);
  }


  public logout() {
    this.user.logout();
    this.router.navigate(["/login"]);
  }

}
