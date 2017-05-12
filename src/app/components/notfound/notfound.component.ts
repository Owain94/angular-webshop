import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-not-found',
  templateUrl: './notfound.component.pug',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@AutoUnsubscribe()
export class NotFoundComponent implements OnInit, OnDestroy {

  private analyticSubscription: Subscription;

  constructor(private metaService: MetaService,
              private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.metaService.addTags();

    this.analyticSubscription = this.analyticsService.visit('404').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }
}
