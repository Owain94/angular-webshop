import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  template: `
    <button class="button" *ngFor="let tab of tabs" (click)="selectTab(tab)">
      {{ tab.title }}
    </button>
    <ng-content></ng-content>
  `,
  styles: [`
    button {
      margin-right: 10px;
    }
  `],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // tslint:disable-next-line:no-shadowed-variable
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
  }
}
