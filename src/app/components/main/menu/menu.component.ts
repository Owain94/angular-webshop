import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../services/user.service';
import { ContactService } from '../../../services/contact.service';

import { AuthGuard } from '../../../guards/auth.guard';
import { AdminGuard } from '../../../guards/admin.guard';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.pug',
  styleUrls: ['./menu.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})

@AutoUnsubscribe()
export class MenuComponent implements OnInit, OnDestroy {
  public loggedIn: boolean;
  // tslint:disable-next-line:no-inferrable-types
  public admin: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public collapsed: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  public url: string = '/';

  public messageCount: string;

  private messageCountSubscription: Subscription;
  private routerEventsSubscription: Subscription;

  constructor(private router: Router,
              private authGuard: AuthGuard,
              private adminGuard: AdminGuard,
              private userService: UserService,
              private contactService: ContactService) {}

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.subscribe((url: any) => {
      if (url instanceof NavigationEnd) {
        if (this.admin) {
          this.getMessageCount();
        }
      }

      if (typeof(url.url) !== 'undefined') {
        this.url = url.url;

        this.loggedIn = this.authGuard.check();
        this.admin = this.adminGuard.checkLocal();
      }
    });

    this.loggedIn = this.authGuard.check();
    this.admin = this.adminGuard.checkLocal();
  }

  ngOnDestroy(): void {
    // pass
  }

  private getMessageCount(): void {
    this.messageCountSubscription = this.contactService.getMessagesCount('admin').subscribe(
      (res: {error: boolean, count: string}) => {
        this.messageCount = res.count;
      }
    );
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
