import {NgModule, Component} from '@angular/core';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-lazy',
  template: `<h3>i'm lazy</h3>`
})
export class LazyViewComponent {}

@NgModule({
  declarations: [LazyViewComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: LazyViewComponent, pathMatch: 'full'}
    ])
  ]
})
export class LazyModule {

}
