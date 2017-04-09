import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminGuard } from '../../guards/admin.guard';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(private adminGuard: AdminGuard) {}

  ngOnInit(): void {
    this.adminGuard.checkRemote();
  }
}
