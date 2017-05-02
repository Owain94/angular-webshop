import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './notfound.component.pug',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
  }
}
