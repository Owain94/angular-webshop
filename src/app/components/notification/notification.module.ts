import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { NotificationsService } from '../../services/notifications.service';

import { MaxPipe } from '../../pipes/max.pipe';
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
    NotificationsService
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule {}
