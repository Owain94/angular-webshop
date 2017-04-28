/// <reference path="../interfaces/generic.interface.ts" />
/// <reference path="../interfaces/admin/verify.interface.ts" />

import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { LocalStorageService } from './localstorage.service';

import { url } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminService {
  private options: RequestOptions;

  constructor(private http: Http,
              private localStorageService: LocalStorageService) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public checkAdmin(): Observable<boolean> {
    return this.http.post(`${url}/api/check_admin/`, this.localStorageService.get('user'), this.options)
      .map((res: any) => res.json())
      .map((res: adminVerify.RootObject) => {
        return <boolean> res.admin;
      });
  }

  public addCategory(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/add_category/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public updateCategory(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/update_category/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public deleteCategory(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/delete_category/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public addProduct(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/add_product/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public updateProduct(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/update_product/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public deleteProduct(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/delete_product/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }
}
