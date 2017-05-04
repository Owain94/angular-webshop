import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsService {

  public visit(page: string) {
    if (/*process.env.NODE_ENV === 'production' && */typeof(window) !== 'undefined') {
      console.log(page);
    }
  }

  public product(id: string) {
    if (/*process.env.NODE_ENV === 'production' && */typeof(window) !== 'undefined') {
      console.log(id);
    }
  }

}
