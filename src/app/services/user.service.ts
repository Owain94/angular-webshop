/// <reference path="../interfaces/generic.interface.ts" />
/// <reference path="../interfaces/user/profile.interface.ts" />
/// <reference path="../interfaces/user/verify.interface.ts" />
/// <reference path="../interfaces/user/tfa.token.interface.ts" />
/// <reference path="../interfaces/user/check.tfa.interface.ts" />

import { LocalStorageService } from './localstorage.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from '../decorators/auto.unsubscribe.decorator';

import { url } from '../../helpers/constants';

import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@AutoUnsubscribe()
@Injectable()
export class UserService implements OnDestroy {
  private options: RequestOptions;

  private verifyLogoutSubscription: Subscription;

  constructor(private http: Http,
              private router: Router,
              private localStorageService: LocalStorageService) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  ngOnDestroy(): void {
    // pass
  }

  public register(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/users/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public checkTfa(email: string): Observable<boolean> {
    return this.http.post(`${url}/api/users/check_tfa/`, { email: email }, this.options)
      .map((res: any) => res.json())
      .map((res: checkTfaInterface.RootObject) => {
        return <boolean> (res.tfa.length > 0);
      });
  }

  public login(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/users/login/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public profileData(): Observable<profileInterface.RootObject> {
    return this.http.post(`${url}/api/users/profile/`, this.localStorageService.get('user'), this.options)
      .map((res: any) => res.json())
      .map((res: profileInterface.RootObject) => {
        return res;
      });
  }

  public saveProfileData(data: Object): Observable<genericInterface.RootObject> {
    return this.http.put(`${url}/api/users/`, {'user': this.localStorageService.get('user'), 'data': data}, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public saveProfilePassword(data: Object): Observable<genericInterface.RootObject> {
    return this.http.put(`${url}/api/users/password/`, {'user': this.localStorageService.get('user'), 'data': data}, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public verify(): Observable<boolean> {
    return this.http.post(`${url}/api/users/verify/`, this.localStorageService.get('user'), this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verify;
      });
  }

  public verifyLogout(): void {
    this.verifyLogoutSubscription = this.http.post(`${url}/api/users/verify/`, this.localStorageService.get('user'), this.options)
      .map((res: any) => res.json())
      .map((res: userVerifyInterface.RootObject) => {
        return <string> res.verify;
      }).subscribe((val: string) => {
        if (!Boolean(val)) {
          this.logout();
        }
      });
  }

  public tfaToken(): Observable<tfaTokenInterface.RootObject> {
    return this.http.get(`${url}/api/users/tfa/`, this.options)
      .map((res: any) => res.json())
      .map((res: tfaTokenInterface.RootObject) => {
        return res;
      });
  }

  public verifyTfaAndSave(key: string, token: string): Observable<string> {
    // tslint:disable-next-line:max-line-length
    return this.http.post(`${url}/api/users/tfa/`, { key: key, token: token, user: this.localStorageService.get('user') }, this.options)
      .map((res: any) => res.json())
      .map((res: {error: string}) => {
        return res.error;
      });
  }

  public disableTfa(): Observable<string> {
    return this.http.put(`${url}/api/users/tfa/`, {'user': this.localStorageService.get('user'), 'data': {tfatoken: ''}}, this.options)
      .map((res: any) => res.json())
      .map((res: {error: string}) => {
        return res.error;
      });
  }

  public logout(): void {
    this.localStorageService.remove('user');
    this.router.navigateByUrl('/login');
  }
}
