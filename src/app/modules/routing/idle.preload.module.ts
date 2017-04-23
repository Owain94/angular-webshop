import { NgZone, NgModule, ModuleWithProviders, Inject, OpaqueToken, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

export const REQUEST_IDLE_CALLBACK = new OpaqueToken('REQUEST_IDLE_CALLBACK');

export function requestIdle(ngzone: NgZone) {
  if (typeof(window) !== 'undefined') {
    if ('requestIdleCallback' in window) {
      return (fn) => window['requestIdleCallback'](fn);
    }

    return (fn) => ngzone.runOutsideAngular(() => window.setTimeout(fn, 10));
  }
}

@Injectable()
export class IdlePreload {
  constructor(private ngZone: NgZone,
              @Inject(REQUEST_IDLE_CALLBACK) private requestIdleCallback: any) {
  }

  preload(route: any, fn: () => Observable<any>): Observable<any> {
    try {
      this.requestIdleCallback(fn);
    } catch (err) {
    }
    return Observable.of(null);
  }
}

export const IDLE_PRELOAD_PROVIDERS: any[] = [
  {
    provide: IdlePreload,
    useClass: IdlePreload
  }
];

export const REQUEST_IDLE_CALLBACK_PROVIDERS: any[] = [
  {
    provide: REQUEST_IDLE_CALLBACK,
    useFactory: requestIdle,
    deps: [ NgZone ] }
];

@NgModule({
  imports: [
    CommonModule
  ]
})
export class IdlePreloadModule {
  static forRoot(config: any = {}): ModuleWithProviders {
    return {
      ngModule: IdlePreloadModule,
      providers: [
        ...(config.requestIdleCallback === false ? [] : REQUEST_IDLE_CALLBACK_PROVIDERS),
        ...IDLE_PRELOAD_PROVIDERS
      ]
    };
  }

  static IdleStrategy() {
    return IdlePreload;
  }
}
