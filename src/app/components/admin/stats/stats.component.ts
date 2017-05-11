import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AnalyticsService } from '../../../services/analytics.service';

import { AdminGuard } from './../../../guards/admin.guard';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './stats.component.pug',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@AutoUnsubscribe()
export class AdminStatsComponent implements OnInit, OnDestroy {
  private analyticSubscription: Subscription;

  constructor(private adminGuard: AdminGuard,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

    this.analyticSubscription = this.analyticsService.visit('AdminStats').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }
}

