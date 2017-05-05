import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.pug',
  styleUrls: ['./footer.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor() {}
}
