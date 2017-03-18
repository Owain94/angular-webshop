import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { postalKey } from '../../constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostalcodeService {

  constructor(private http: Http) {}

  public getPostalcodeData(postalcode: string): Observable<[string, string]> {
    const headers = new Headers();
    headers.append('X-Api-Key', postalKey);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`https://postcode-api.apiwise.nl/v2/postcodes/${postalcode}/`, options)
      .map((res: any) => res.json())
      .map((res: any) => {
        return [res.city.label, res.streets[0]];
      });
  }
}
