import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { QRCodeModule } from '../profile/qrcode/qrcode.module';

import { ProfileComponent } from './profile.component';
import { TabsComponent } from '../tabs/tabs.component';
import { TabComponent } from '../tabs/tab/tab.component';

import { UserService } from '../../services/user.service';

@NgModule({
  declarations: [
    ProfileComponent,
    TabsComponent,
    TabComponent
  ],
  imports: [
    HeaderModule,
    QRCodeModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: ProfileComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    UserService
  ]
})
export class ProfileModule {}
