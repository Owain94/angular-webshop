import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminGuard } from './../../../guards/admin.guard';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './stats.component.pug',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@AutoUnsubscribe()
export class AdminStatsComponent implements OnInit, OnDestroy {

  constructor(private adminGuard: AdminGuard) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();
  }

  ngOnDestroy(): void {
    // pass
  }
}

