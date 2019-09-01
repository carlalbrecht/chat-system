import { Component, OnInit } from "@angular/core";

import { UserService, ROLES } from "src/app/services/user.service";
import { UserListService, UserList } from "src/app/services/user-list.service";


@Component({
  selector: "page-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {

  public readonly roles = ROLES;

  public users: UserList = {};


  /**
   * Function re-export to allow iterating `users` inside template.
   */
  public objectKeys = Object.keys;


  constructor(
    public user: UserService,
    private userList: UserListService
  ) { }


  public async ngOnInit() {
    this.users = await this.userList.getList();
  }


  public generateUser() {
    const PREFIX = "#new_user_";
    let i = 0;

    // Generate unique name
    while (this.users.hasOwnProperty(`${PREFIX}${i}`)) {
      i++;
    }

    this.users[`${PREFIX}${i}`] = {
      role: ROLES[0]
    };
  }


  public deleteUser(name: string) {
    delete this.users[name];
  }


  public async cancelUsersEdit() {
    this.users = await this.userList.getList();
  }


  public async saveUsersEdit() {
    await this.userList.setList(this.users);
    this.users = await this.userList.getList();
  }

}
