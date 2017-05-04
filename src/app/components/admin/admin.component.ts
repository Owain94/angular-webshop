import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';
import { PageAnalytics } from '../../decorators/page.analytic.decorator';

import { AdminGuard } from '../../guards/admin.guard';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@PageAnalytics('Admin')
export class AdminComponent implements OnInit {

  constructor(private adminGuard: AdminGuard,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();
  }
}
