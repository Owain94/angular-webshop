/// <reference path="../../../interfaces/generic.interface.ts" />
/// <reference path="../../../interfaces/messages/messages.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { ContactService } from '../../../services/contact.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { NotificationsService } from '../../../services/notifications.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './messages.component.pug',
  styleUrls: ['./messages.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminMessagesComponent implements OnInit, OnDestroy {

  public messages: messagesInterface.RootObject;

  private messageSubscription: Subscription;
  private analyticSubscription: Subscription;

  constructor(private adminGuard: AdminGuard,
              private contactService: ContactService,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

    this.getMessages();

    this.analyticSubscription = this.analyticsService.visit('AdminMessages').subscribe();
  }

  private getMessages() {
    this.messageSubscription = this.contactService.getMessages('admin').subscribe(
      (res: messagesInterface.RootObject) => {
        this.messages = res;
      }
    );
  }

  ngOnDestroy(): void {
    // pass
  }

  public markAsRead(id: string): void {
    this.contactService.markMessageAsRead(id).subscribe(
      () => {
        this.notificationsService.success('Gelezen!', 'Het bericht is als gelezen gemarkeerd!');
        this.getMessages();
      }
    );
  }

  public trackByFn(index: number, item: categoriesInterface.RootObject): string {
    return(item._id);
  }
}
