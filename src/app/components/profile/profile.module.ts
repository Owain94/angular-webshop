import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
    UserService,
    MetaService
  ]
})
export class ProfileModule {}
