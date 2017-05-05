import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';
import { PageAnalytics } from '../../decorators/page.analytic.decorator';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './notfound.component.pug',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@PageAnalytics('404')
export class NotFoundComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
  }
}
