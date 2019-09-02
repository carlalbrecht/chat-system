import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from 'src/app/services/user.service';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: "page-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {

  public currentGroup: string = "Current Group";
  public currentChannel: string = "the-current-channel";

  public newGroupName: string = "";
  public newChannelName: string = "";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    public user: UserService
  ) {
    route.params.subscribe(params => {
      console.log(params);
    });
  }


  public addGroup() {
    this.newGroupName = "";
    this.modal.open("modal-create-group");
  }


  public cancelAddGroup() {
    this.modal.close("modal-create-group");
  }


  public doAddGroup() {
    this.modal.close("modal-create-group");
  }


  public addChannel() {
    this.newChannelName = "";
    this.modal.open("modal-create-channel");
  }


  public cancelAddChannel() {
    this.modal.close("modal-create-channel");
  }


  public doAddChannel() {
    this.modal.close("modal-create-channel");
  }


  public dashboard() {
    this.router.navigate(["/dashboard"]);
  }


  public logout() {
    this.user.logout();
    this.router.navigate(["/login"]);
  }

}
