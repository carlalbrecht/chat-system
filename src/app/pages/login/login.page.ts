import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "page-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {

  public username: string = "";
  public password: string = "";

  private readonly nextPage: string = "/chat";
  private returnRoute: string | undefined = undefined;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private user: UserService
  ) { }


  public ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.returnRoute = params["return"];
    })
  }


  public async login() {
    if (await this.user.login(this.username, this.password)) {
      this.router.navigate([
        this.returnRoute !== undefined ? this.returnRoute : this.nextPage
      ]);
    }
  }

}
