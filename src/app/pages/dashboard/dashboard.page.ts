import { Component } from "@angular/core";

import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "page-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage {

  constructor(private user: UserService) { }

}
