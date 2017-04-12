import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  @Input('tabTitle') tabTitle: string;
  // tslint:disable-next-line:no-inferrable-types
  @Input() active: boolean = false;
}
