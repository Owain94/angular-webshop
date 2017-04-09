import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { LocalStorageService } from '../services/localstorage.service';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private localStorageService: LocalStorageService) { }

  canActivate(): boolean {
    if (typeof(window) !== 'undefined' && this.localStorageService.get('user')) {
      if (!tokenNotExpired(null, <string> this.localStorageService.get('user'))) {
        this.localStorageService.remove('user');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  public check(): boolean {
    if (typeof(window) !== 'undefined' && this.localStorageService.get('user')) {
      if (!tokenNotExpired(null, <string> this.localStorageService.get('user'))) {
        this.localStorageService.remove('user');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    return false;
  }
}
