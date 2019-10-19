import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class NavigationService {
  constructor(
    private _router: Router
  ) {
  }

  login(): void {
    this._router.navigate(['/login']);
  }

  users(): void {
    this._router.navigate(['/users']);
  }

  chat(): void {
    this._router.navigate(['/chat']);
  }
}
