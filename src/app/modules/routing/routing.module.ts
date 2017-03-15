import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdlePreloadModule, IdlePreload } from './idle.preload.module';

import { HomeViewComponent } from '../../components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    pathMatch: 'full'
  },
  {
    path: 'lazy',
    loadChildren: '../../components/+lazy/lazy.module#LazyModule'
  }, {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [
    IdlePreloadModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: false, preloadingStrategy: IdlePreload})
  ],
  providers: [

  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule {
}
