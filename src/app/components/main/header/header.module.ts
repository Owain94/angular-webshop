import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header.component';

import * as Raven from 'raven-js';

Raven
  .config('https://03d884b718be42638de950df2a94a5d3@sentry.io/189340')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
  }
}

export function provideErrorHandler() {
  if (process.env.NODE_ENV === 'production') {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    }
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule {}
