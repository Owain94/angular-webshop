/// <reference path="../interfaces/generic.interface.ts" />
/// <reference path="../interfaces/messages/messages.interface.ts" />

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { url } from '../../helpers/constants';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactService {
  private options: RequestOptions;

  constructor(private http: Http) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
  }

  public contact(data: Object): Observable<genericInterface.RootObject> {
    return this.http.post(`${url}/api/contact/`, data, this.options)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }

  public getMessages(receiver: string): Observable<messagesInterface.RootObject> {
    return this.http.get(`${url}/api/get_messages/${receiver}`)
      .map((res: any) => res.json())
      .map((res: messagesInterface.RootObject) => {
        return res;
      });
  }

  public getMessagesCount(receiver: string): Observable<{error: boolean, count: string}> {
    return this.http.get(`${url}/api/get_unread_messages/${receiver}`)
      .map((res: any) => res.json())
      .map((res: {error: boolean, count: string}) => {
        return res;
      });
  }

  public markMessageAsRead(id: string): Observable<genericInterface.RootObject> {
    return this.http.get(`${url}/api/mark_read_messages/${id}`)
      .map((res: any) => res.json())
      .map((res: genericInterface.RootObject) => {
        return res;
      });
  }
}
