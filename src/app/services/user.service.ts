import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})
export class UserService {

  private isAuthenticated: boolean = false;


  public get authenticated(): boolean {
    return this.isAuthenticated;
  }


  public async login(username: string, password: string): Promise<boolean> {
    this.isAuthenticated = true;
    return true;
  }

}
