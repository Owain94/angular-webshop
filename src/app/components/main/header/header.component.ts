import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() public headerImage: string;
  @Input() public headerHeading: [string, string];
  @Input() public headerButton: [string, string];

  constructor() {}
}
