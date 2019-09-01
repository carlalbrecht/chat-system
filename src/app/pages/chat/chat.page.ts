import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "page-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {

  public currentGroup: string = "Current Group";
  public currentChannel: string = "the-current-channel";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public user: UserService
  ) {
    route.params.subscribe(params => {
      console.log(params);
    });
  }


  public dashboard() {
    this.router.navigate(["/dashboard"]);
  }


  public logout() {
    this.user.logout();
    this.router.navigate(["/login"]);
  }

}
