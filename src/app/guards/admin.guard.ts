import { LocalStorageService } from './../services/localstorage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, CanActivateChild } from '@angular/router';

import { AdminService } from '../services/admin.service';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private router: Router,
              private adminService: AdminService,
              private localStorageService: LocalStorageService) { }

  canActivate(): boolean {
    if (this.checkLocal()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  canLoad(): boolean {
    if (this.checkLocal()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  public checkLocal(): boolean {
    if (typeof(window) !== 'undefined' && this.localStorageService.get('user')) {
      if (!tokenNotExpired(null, <string> this.localStorageService.get('user'))) {
        this.localStorageService.remove('user');
        this.router.navigate(['/login']);
        return false;
      }

      try {
        if (new JwtHelper().decodeToken(<string> this.localStorageService.get('user')).data.admin === true) {
          return true;
        }
      } catch (err) {}
    }
    return false;
  }

  public checkRemote(): void {
    this.adminService.checkAdmin().subscribe(
      (res: boolean) => {
        if (!res) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
