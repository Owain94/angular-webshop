import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';

import { AdminGuard } from '../../guards/admin.guard';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminComponent implements OnInit, OnDestroy {
  private analyticSubscription: Subscription;

  constructor(private adminGuard: AdminGuard,
              private analyticsService: AnalyticsService,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();

    this.analyticSubscription = this.analyticsService.visit('Admin').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }
}
