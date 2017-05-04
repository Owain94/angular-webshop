import { ReflectiveInjector } from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';

export function PageAnalytics(pageName: string): ClassDecorator {

  return function (constructor: any) {
    const injector = ReflectiveInjector.resolveAndCreate([AnalyticsService]);
    const analyticsService = injector.get(AnalyticsService);
    const ngOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function (...args: Array<any>) {
      analyticsService.visit(pageName);
      // tslint:disable-next-line:no-unused-expression
      ngOnInit && ngOnInit.apply(this, args);
    };
  };
}
