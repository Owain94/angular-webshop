import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';

import { url } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AnalyticsService {
  private options: RequestOptions;

  constructor(private http: Http,
              @Inject(PLATFORM_ID) private platformId: Object) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public visit(page: string): Observable<boolean> {
    if (/*process.env.NODE_ENV === 'production' && */isPlatformBrowser(this.platformId)) {
      return this.http.post(`${url}/api/stats_page/`, {'page': page}, this.options)
      .map((res: any) => res.json())
      .map((res: boolean) => {
        return res['error'];
      });
    }
    return Observable.of(false);
  }

  public product(id: string): Observable<boolean> {
    if (/*process.env.NODE_ENV === 'production' && */isPlatformBrowser(this.platformId)) {
      return this.http.post(`${url}/api/stats_product/`, {'product': id}, this.options)
      .map((res: any) => res.json())
      .map((res: boolean) => {
        return res['error'];
      });
    }
    return Observable.of(false);
  }
}
