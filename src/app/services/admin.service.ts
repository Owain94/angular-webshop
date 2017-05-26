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
    return this.http.post(`${url}/api/categories/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public updateCategory(id: string, data: Object): Observable<genericInterface.RootObject> {
    return this.http.put(`${url}/api/categories/${id}`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public deleteCategory(id: string): Observable<genericInterface.RootObject> {
    return this.http.delete(`${url}/api/categories/${id}`, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public addProduct(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/products/product/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public updateProduct(id: string, data: Object): Observable<genericInterface.RootObject> {
    return this.http.put(`${url}/api/products/product/${id}`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public deleteProduct(id: string): Observable<genericInterface.RootObject> {
    return this.http.delete(`${url}/api/products/product/${id}`, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }
}
