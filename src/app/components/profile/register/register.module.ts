import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../../main/header/header.module';
import { NotificationsModule } from '../../notification/notification.module';

import { RegisterComponent } from './register.component';

import { PostalcodeService } from '../../../services/postalcode.service';
import { UserService } from '../../../services/user.service';
import { MetaService } from '../../../services/meta.service';
import { AnalyticsService } from '../../../services/analytics.service';

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
    RegisterComponent
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
          component: RegisterComponent,
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
    PostalcodeService,
    UserService,
    MetaService,
    AnalyticsService
  ]
})
export class RegisterModule {}
