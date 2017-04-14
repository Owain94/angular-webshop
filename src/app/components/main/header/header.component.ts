import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.pug',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() public headerHeading: [string, string];
  @Input() public headerButton: [string, string];

  constructor() {}
}
