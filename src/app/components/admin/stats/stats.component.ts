import { Component, OnInit, OnDestroy } from '@angular/core';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminGuard } from './../../../guards/admin.guard';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './stats.component.pug',
  styleUrls: ['./stats.component.css']
})

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

