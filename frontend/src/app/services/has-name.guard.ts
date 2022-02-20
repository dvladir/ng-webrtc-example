import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ClientStateService} from '../sub-modules/client';
import {NavigationService} from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class HasNameGuard implements CanActivate {

  constructor(
    private _clientState: ClientStateService,
    private _nav: NavigationService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this._clientState.currentClient.name) {
      this._nav.login();
      return false;
    }

    return true;
  }

}
