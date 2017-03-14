import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TransferHttp } from '../../modules/transfer-http/transfer-http';

@Component({
  selector: 'app-home',
  template: `<h3>{{subs | async}}</h3>`
})
export class HomeViewComponent implements OnInit {
  public subs: Observable<string>;

  constructor(private http: TransferHttp) {}

  ngOnInit() {
    this.subs = this.http.get('http://localhost:8000/data').map(data => {
      return `${data.greeting} ${data.name}`;
    });
  }
}
