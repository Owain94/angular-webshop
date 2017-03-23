import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Router } from '@angular/router';

import { url } from './../../constants';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
  private options: RequestOptions;

  constructor(private http: Http,
              private router: Router) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public register(data: Object): Observable<any> {
    return this.http.post(`${url}/api/register/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public checkTfa(email: string): Observable<boolean> {
    return this.http.post(`${url}/api/check_tfa/`, {email: email} , this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.tfa.length > 0;
      });
  }

  public login(data: Object): Observable<any> {
    return this.http.post(`${url}/api/login/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public profileData(): Observable<any> {
    return this.http.post(`${url}/api/get_profile/`, localStorage.getItem('user'), this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public saveProfileData(data: Object): Observable<any> {
    return this.http.post(`${url}/api/save_profile/`, [localStorage.getItem('user'), data], this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public saveProfilePassword(data: Object): Observable<any> {
    return this.http.post(`${url}/api/save_password/`, [localStorage.getItem('user'), data], this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public verify(): Observable<boolean> {
    return this.http.post(`${url}/api/verify/`, localStorage.getItem('user'), this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verify;
      });
  }

  public verifyLogout(): void {
    this.http.post(`${url}/api/verify/`, localStorage.getItem('user'), this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verify;
      }).subscribe((val) => {
        if (!Boolean(val)) {
          this.logout();
        }
      });
  }

  public tfaToken(): Observable<any> {
    return this.http.get(`${url}/api/generate_tfa_token/`, this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public verifyTfaToken(key: string, token: string): Observable<boolean> {
    return this.http.post(`${url}/api/verify_tfa_token/`, {key: key, token: token, user: localStorage.getItem('user')}, this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verified;
      });
  }

  public disableTfa(): Observable<boolean> {
    return this.http.post(`${url}/api/disable_tfa/`, localStorage.getItem('user'), this.options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.res;
      });
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
