import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminGuard } from '../../guards/admin.guard';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(private adminGuard: AdminGuard,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.removeTags();
    this.adminGuard.checkRemote();
  }
}
