import { Component, Inject, OnInit, NgZone } from "@angular/core";

import { UserAttributes, UserService, ROLES } from "src/app/services/user.service";
import { UserListService, UserRelationalMapping } from "src/app/services/user-list.service";
import { MediaService } from 'src/app/services/media.service';


interface RenamableUserAttributes extends UserAttributes {
  new_name?: string;
}

type RenamableUserList = UserRelationalMapping<RenamableUserAttributes>;


@Component({
  selector: "page-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {

  public readonly roles = ROLES;

  public users: RenamableUserList = {};


  /**
   * Function re-export to allow iterating `users` inside template.
   */
  public objectKeys = Object.keys;


  constructor(
    private zone: NgZone,
    private userList: UserListService,
    private media: MediaService,
    public user: UserService,
    @Inject("BASE_URL") private HOST: string,
  ) { }


  public async ngOnInit() {
    await this.reloadUsers();
  }


  public async uploadProfilePicture() {
    const mediaID: string = await this.media.selectAndUploadImage();
    this.user.setProfilePicture(mediaID);
  }


  public generateUser() {
    const PREFIX = "$new_user_";
    let i = 0;

    // Generate unique name
    while (this.users.hasOwnProperty(`${PREFIX}${i}`)) {
      i++;
    }

    this.users[`${PREFIX}${i}`] = {
      role: ROLES[0],
      password: "",
      new_name: `${PREFIX}${i}`
    };
  }


  public deleteUser(name: string) {
    delete this.users[name];
  }


  public async reloadUsers() {
    this.users = await this.userList.getList();

    this.zone.run(() => {
      for (let user of Object.keys(this.users)) {
        this.users[user].new_name = user;
      }
    });
  }


  public async saveUsersEdit() {
    let newUsers = {};

    // Copy all users and rename
    for (let user of Object.keys(this.users)) {
      newUsers[this.users[user].new_name] = this.users[user];
      delete newUsers[this.users[user].new_name].new_name;
    }

    await this.userList.setList(newUsers);
    await this.reloadUsers();
  }

}
