/// <reference path="../interfaces/products/products.interface.ts" />
/// <reference path="../interfaces/products/categories.interface.ts" />

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { TransferHttp } from '../modules/transfer-http/transfer-http';

import { url } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {
  private options: RequestOptions;

  constructor(private http: Http,
              private transferHttp: TransferHttp) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public products(amount: number, admin: boolean = false): Observable<Array<productsInterface.RootObject>> {
    if (!admin) {
      return this.transferHttp.get(`${url}/api/products/${amount}`)
        .map((res: Array<productsInterface.RootObject>) => {
          return res;
        });
    }

    return this.http.get(`${url}/api/products/${amount}`)
      .map((res: any) => res.json())
      .map((res: Array<productsInterface.RootObject>) => {
        return res;
      });
  }

  public product(id: string, admin: boolean = false): Observable<productsInterface.RootObject> {
    if (!admin) {
      return this.transferHttp.get(`${url}/api/product/${id}`)
        .map((res: productsInterface.RootObject) => {
          return res;
        });
    }
    return this.http.get(`${url}/api/product/${id}`)
      .map((res: any) => res.json())
      .map((res: productsInterface.RootObject) => {
        return res;
      });
  }

  public categories(admin: boolean = false): Observable<categoriesInterface.RootObject> {
    if (!admin) {
      return this.transferHttp.get(`${url}/api/categories/`)
        .map((res: categoriesInterface.RootObject) => {
          return res;
        });
    }
    return this.http.get(`${url}/api/categories/`)
      .map((res: any) => res.json())
      .map((res: categoriesInterface.RootObject) => {
        return res;
      });
  }
}
