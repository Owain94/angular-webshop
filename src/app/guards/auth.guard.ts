import { isPlatformBrowser } from '@angular/common/';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { LocalStorageService } from '../services/localstorage.service';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  private defaultCheck() {
    if (isPlatformBrowser(this.platformId) && this.localStorageService.get('user')) {
      if (!tokenNotExpired(undefined, <string> this.localStorageService.get('user'))) {
        this.localStorageService.remove('user');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    return false;
  }

  canActivate(): boolean {
    return this.defaultCheck();
  }

  public check(): boolean {
    return this.defaultCheck();
  }
}
