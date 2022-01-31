import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      //dont need to subscribe here V205
    return this.accountService.currenUser$.pipe(
      //auth is current user
      map(auth => {
        if (auth) {
          return true;
        }
        //if not logged in
        //returnUrl is passed from auth guard to login comp V205, go to app-routing moduel to apply route
        // state.url is checkout url
        this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}})
      })
    )
  }

}
