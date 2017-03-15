import { NotFoundComponent } from './notfound.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    RouterModule.forChild(
      [
        {
          path: '',
          component: NotFoundComponent,
          pathMatch: 'full'
        }
      ]
    )
  ]
})
export class NotFoundModule {

}
