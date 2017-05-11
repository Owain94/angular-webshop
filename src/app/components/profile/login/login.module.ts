import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../../main/header/header.module';
import { NotificationsModule } from '../../notification/notification.module';

import { LoginComponent } from './login.component';

import { UserService } from '../../../services/user.service';
import { MetaService } from '../../../services/meta.service';
import { AnalyticsService } from '../../../services/analytics.service';

@NgModule({
  declarations: [
    LoginComponent
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
          component: LoginComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    UserService,
    MetaService,
    AnalyticsService
  ]
})
export class LoginModule {}
