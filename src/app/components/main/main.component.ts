import { Component, OnInit, HostListener } from '@angular/core';

import { TransferState } from '../../modules/transfer-state/transfer-state';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private transferState: TransferState,
              private userService: UserService) {}

  ngOnInit(): void {
    this.transferState.set('cached', true);
  }
  
  private scrollTo(event: any): void {
    let windowRef = event.view;
    let documentRef = event.view.document;

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
      let percent = Math.min(time / 500, 1);
      percent = easing(percent);
      windowRef.scrollTo(0, startingY + diff * percent);
      if (time < 500) {
        windowRef.requestAnimationFrame(step);
      }
    });
  }
}
