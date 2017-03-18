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

  public logout(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }
}
