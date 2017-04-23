import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MetaService } from '../../../services/meta.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.pug',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private metaService: MetaService,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.userService.verifyLogout();
  }
}
