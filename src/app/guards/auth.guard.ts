import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (typeof(window) !== 'undefined' && localStorage.getItem('user')) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }

    public check() {
        if (typeof(window) !== 'undefined' && localStorage.getItem('user')) {
            return true;
        }
        return false;
    }
}
