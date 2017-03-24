import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('tabTitle') title: string;
  @Input() active = false;
}
