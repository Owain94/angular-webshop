import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('navbar') navbar: ElementRef;

  public loggedIn: boolean;
  // tslint:disable-next-line:no-inferrable-types
  public collapsed: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  public url: string = '/';

  constructor(private router: Router,
              private authGuard: AuthGuard,
              private userService: UserService) {}

  ngOnInit(): void {
    this.router.events.subscribe((url: any) => {
      this.loggedIn = this.authGuard.check();
      if (typeof(url.url) !== 'undefined') {
        this.url = url.url;
      }
    });

    this.loggedIn = this.authGuard.check();
  }

  public navBarClick(force: boolean = false): void {
    if (force) {
      this.collapsed = true;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  public signout(): void {
    this.collapsed = true;
    this.userService.logout();
    this.loggedIn = this.authGuard.check();
  }
}
