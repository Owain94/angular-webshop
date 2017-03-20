import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Router } from '@angular/router';

import { url } from './../../constants';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {

  constructor(private http: Http,
              private router: Router) {}

  public register(data: Object): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${url}/api/register/`, data, options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public login(data: Object): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${url}/api/login/`, data, options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public profileData(): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${url}/api/get_profile/`, localStorage.getItem('user'), options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public saveProfileData(data: Object): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${url}/api/save_profile/`, [localStorage.getItem('user'), data], options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res;
      });
  }

  public verify(): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${url}/api/verify/`, localStorage.getItem('user'), options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verify;
      });
  }

  public verifyLogout(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    this.http.post(`${url}/api/verify/`, localStorage.getItem('user'), options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return res.verify;
      }).subscribe((val) => {
        if (!Boolean(val)) {
          this.logout();
        }
      });
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }
}
