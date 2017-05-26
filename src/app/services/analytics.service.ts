/// <reference path="../interfaces/generic.interface.ts" />
/// <reference path="../interfaces/admin/total.stats.interface.ts" />
/// <reference path="../interfaces/admin/range.stats.interface.ts" />

import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';

import { url } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class AnalyticsService {
  private options: RequestOptions;

  constructor(private http: Http,
              @Inject(PLATFORM_ID) private platformId: Object) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public visit(page: string, type: boolean = true): Observable<boolean> {
    if (process.env.NODE_ENV === 'production' && isPlatformBrowser(this.platformId)) {
      let obj: Object;

      if (type) {
        obj = {'page': page};
      } else {
        obj = {'product': page};
      }

      return this.http.post(`${url}/api/stats/`, obj, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return Boolean(res.error);
      });
    }
    return Observable.of(false);
  }

  public getTotalStats(): Observable<totalStats.RootObject> {
    return this.http.get(`${url}/api/stats/total`, this.options)
    .map((res: any) => res.json())
    .map((res: totalStats.RootObject) => {
      return {
        'usercount': res['usercount'],
        'pageviews': res['pageviews'],
        'productviews': res['productviews']
      };
    }).share();
  }

  private _serverError(err: any) {
    console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return Observable.throw(err.json() || 'backend server error');
    }
    return Observable.throw(err || 'backend server error');
  }

  public getStatsInRange(from: number, to: number): Observable<Array<rangeStats.RootObject>> {
    return this.http.get(`${url}/api/stats/range?from=${from}&to=${to}/`, this.options)
    .map((res: any) => res.json())
    .map((res: Array<rangeStats.RootObject>) => {
      return res;
    }).catch(this._serverError).share();
  }
}
