import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../services/user.service';

import { AuthGuard } from '../../../guards/auth.guard';
import { AdminGuard } from '../../../guards/admin.guard';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.pug',
  styleUrls: ['./menu.component.css']
})

@AutoUnsubscribe()
export class MenuComponent implements OnInit {
  public loggedIn: boolean;
  // tslint:disable-next-line:no-inferrable-types
  public admin: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public collapsed: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  public url: string = '/';

  private routerEventsSubscription: Subscription;

  constructor(private router: Router,
              private authGuard: AuthGuard,
              private adminGuard: AdminGuard,
              private userService: UserService) {}

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.subscribe((url: any) => {
      this.loggedIn = this.authGuard.check();
      this.admin = this.adminGuard.checkLocal();
      if (typeof(url.url) !== 'undefined') {
        this.url = url.url;
      }
    });

    this.loggedIn = this.authGuard.check();
    this.admin = this.adminGuard.checkLocal();
  }

  public navBarClick(force: boolean = false): void {
    if (force) {
      this.collapsed = true;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  public signout(): void {
    this.navBarClick(true);
    this.userService.logout();
    this.loggedIn = this.authGuard.check();
  }
}
