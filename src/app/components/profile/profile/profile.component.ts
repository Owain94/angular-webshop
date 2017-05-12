import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';

import { MetaService } from '../../../services/meta.service';
import { UserService } from '../../../services/user.service';
import { AnalyticsService } from '../../../services/analytics.service';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class ProfileComponent implements OnInit, OnDestroy {

  private analyticSubscription: Subscription;

  constructor(private metaService: MetaService,
              private analyticsService: AnalyticsService,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.userService.verifyLogout();

    this.analyticSubscription = this.analyticsService.visit('Profile').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }
}
