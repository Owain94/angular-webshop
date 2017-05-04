import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { PageAnalytics } from '../../../decorators/page.analytic.decorator';

import { MetaService } from '../../../services/meta.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@PageAnalytics('Profile')
export class ProfileComponent implements OnInit {

  constructor(private metaService: MetaService,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.userService.verifyLogout();
  }
}
