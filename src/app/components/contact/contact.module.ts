import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { NotificationsModule } from '../notification/notification.module';

import { ContactComponent } from './contact.component';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserService } from '../../services/user.service';

import { AuthGuard } from '../../guards/auth.guard';

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
    MetaService,
    AnalyticsService,
    UserService,
    AuthGuard
  ]
})
export class ContactModule {}
