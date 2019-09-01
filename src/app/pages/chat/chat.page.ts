import { Component } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector: "page-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {

  constructor(private router: Router) { }


  public dashboard() {
    this.router.navigate(["/dashboard"]);
  }

}
