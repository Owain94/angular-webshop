import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Log } from '../../decorators/log.decorator';

import { AdminGuard } from '../../guards/admin.guard';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ContactService } from '../../services/contact.service';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.pug',
  styleUrls: ['./admin.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminComponent implements OnInit, OnDestroy {

  public messageCount: string;

  private messageCountSubscription: Subscription;
  private analyticSubscription: Subscription;
  private routerEventsSubscription: Subscription;

  constructor(private router: Router,
              private adminGuard: AdminGuard,
              private contactService: ContactService,
              private analyticsService: AnalyticsService,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();

    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getMessageCount();
      }
    });

    this.getMessageCount();

    this.analyticSubscription = this.analyticsService.visit('Admin').subscribe();
  }

  private getMessageCount(): void {
    this.messageCountSubscription = this.contactService.getMessagesCount('admin').subscribe(
      (res: {error: boolean, count: string}) => {
        this.messageCount = res.count;
      }
    );
  }

  ngOnDestroy(): void {
    // pass
  }
}
