import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { NotificationsService } from '../../services/notifications.service';

import { MaxPipe } from '../../pipes/max.pipe';

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
  imports: [
      CommonModule
  ],
  declarations: [
      NotificationComponent,
      NotificationsComponent,
      MaxPipe
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    NotificationsService
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule {}
