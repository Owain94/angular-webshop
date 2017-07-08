/// <reference path="../interfaces/user/postalcode.interface.ts" />

import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { postalKey } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostalcodeService {

  constructor(private http: Http) {}

  public getPostalcodeData(postalcode: string): Observable<Array<string>> {
    const headers = new Headers();
    headers.append('X-Api-Key', postalKey);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`https://postcode-api.apiwise.nl/v2/postcodes/${postalcode}/`, options)
      .map((res: any) => res.json())
      .map((res: postalcodeInterface.RootObject) => {
        return [res.city.label, res.streets[0]];
      });
  }
}
