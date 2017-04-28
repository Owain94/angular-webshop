/// <reference path="../interfaces/products/products.interface.ts" />
/// <reference path="../interfaces/products/categories.interface.ts" />

import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { TransferHttp } from '../modules/transfer-http/transfer-http';

import { url } from '../../constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {
  private options: RequestOptions;

  constructor(private http: TransferHttp) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public products(amount: number): Observable<productsInterface.RootObject> {
    return this.http.get(`${url}/api/products/${amount}`)
      // .map((res: any) => res.json())
      .map((res: productsInterface.RootObject) => {
        return res;
      });
  }

  public product(id: string): Observable<productsInterface.RootObject> {
    return this.http.get(`${url}/api/product/${id}`)
      // .map((res: any) => res.json())
      .map((res: productsInterface.RootObject) => {
        return res[0];
      });
  }

  public categories(): Observable<categoriesInterface.RootObject> {
    return this.http.get(`${url}/api/categories/`)
      // .map((res: any) => res.json())
      .map((res: categoriesInterface.RootObject) => {
        return res;
      });
  }
}
