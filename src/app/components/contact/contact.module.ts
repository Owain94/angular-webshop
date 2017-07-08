import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { NotificationsModule } from '../notification/notification.module';

import { ContactComponent } from './contact.component';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserService } from '../../services/user.service';
import { ContactService } from '../../services/contact.service';

import { AuthGuard } from '../../guards/auth.guard';

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
    ContactComponent
  ],
  imports: [
    HeaderModule,
    NotificationsModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: ContactComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    MetaService,
    AnalyticsService,
    UserService,
    ContactService,
    AuthGuard
  ]
})
export class ContactModule {}
