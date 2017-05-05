import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.pug',
  styleUrls: ['./header.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() public headerHeading: [string, string];
  @Input() public headerButton: [string, string];

  constructor() {}
}
