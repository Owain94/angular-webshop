import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
    <div [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('tabTitle') title: string;
  @Input() active = false;
}
