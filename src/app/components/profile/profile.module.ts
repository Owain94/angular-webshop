import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { QRCodeModule } from '../profile/qrcode/qrcode.module';
import { NotificationsModule } from '../notification/notification.module';

import { ProfileComponent } from './profile/profile.component';
import { ProfileTfaComponent } from './profile/twofactor/twofactor.component';
import { ProfilePasswordComponent } from './profile/password/password.component';
import { ProfileGeneralComponent } from './profile/general/general.component';

import { UserService } from '../../services/user.service';
import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import * as Raven from 'raven-js';

const routes: Routes =
  [
    {
      path: '',
      component: ProfileComponent,
      children: [
        {
          path: '',
          redirectTo: 'general',
          pathMatch: 'full'
        },
        {
          path: 'general',
          component: ProfileGeneralComponent
        },
        {
          path: 'password',
          component: ProfilePasswordComponent
        },
        {
          path: 'tfa',
          component: ProfileTfaComponent
        }
      ]
    }
  ];

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
    ProfileComponent,
    ProfileGeneralComponent,
    ProfilePasswordComponent,
    ProfileTfaComponent
  ],
  imports: [
    HeaderModule,
    QRCodeModule,
    NotificationsModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      routes
    )
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    UserService,
    MetaService,
    AnalyticsService
  ]
})
export class ProfileModule {}
