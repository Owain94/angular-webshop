import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AdminGuard } from '../../guards/admin.guard';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AdminComponent implements OnInit {

  constructor(private adminGuard: AdminGuard,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();
  }
}
