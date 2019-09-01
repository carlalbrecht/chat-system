import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { UserService } from '../services/user.service';


/**
 * Guard which only allows navigation if the user is logged in.
 */
@Injectable({
  providedIn: "root"
})
export class AuthenticatedGuard implements CanActivate {

  constructor(
    private router: Router,
    private user: UserService
  ) { }


  public async canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.user.authenticated) {
      // Redirect to the login page, and request that we return to the
      // originally requested page, once the user has logged in
      this.router.navigate(["/login"], {
        queryParams: {
          return: state.url
        }
      });

      return false;
    }

    return true;
  }

}
