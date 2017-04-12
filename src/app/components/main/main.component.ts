import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TransferState } from '../../modules/transfer-state/transfer-state';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../services/user.service';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

@AutoUnsubscribe()
export class MainComponent implements OnInit {

  private routerEventsSubscription: Subscription;

  constructor(private transferState: TransferState,
              private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.subscribe(path => {
      if (path instanceof NavigationEnd) {
        if (typeof(window) !== 'undefined') {
          window.scroll(0, 0);
        }
      }
    });

    this.transferState.set('cached', true);
  }

  public scrollTo(event: any): void {
    const windowRef = event.view;
    const documentRef = event.view.document;

    const startingY = windowRef.pageYOffset;
    const elementY = windowRef.pageYOffset + documentRef.querySelector('body').getBoundingClientRect().top;
    const targetY = documentRef.body.scrollHeight - elementY < windowRef.innerHeight ?
      documentRef.body.scrollHeight - windowRef.innerHeight :
      elementY;
    const diff = targetY - 50 - startingY;

    const easing = (t) => {
      return t < .5 ? 4 * t * t * t : (t  - 1)  * (2 * t - 2)  *  (2 * t - 2) + 1;
    };

    let start;

    if (!diff) {
      return;
    }

    windowRef.requestAnimationFrame(function step(timestamp) {
      if (!start) {
        start = timestamp;
      }
      const time = timestamp - start;
      let percent = Math.min(time / 250, 1);
      percent = easing(percent);
      windowRef.scrollTo(0, startingY + diff * percent);
      if (time < 250) {
        windowRef.requestAnimationFrame(step);
      }
    });
  }
}
