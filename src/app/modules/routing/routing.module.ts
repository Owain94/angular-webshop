import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdlePreloadModule, IdlePreload } from './idle.preload.module';

import { HomeComponent } from '../../components/home/home.component';

import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: '../../components/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: '../../components/register/register.module#RegisterModule'
  },
  {
    path: 'profile',
    loadChildren: '../../components/profile/profile.module#ProfileModule',
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: '404',
    loadChildren: '../../components/notfound/notfound.module#NotFoundModule'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [
    IdlePreloadModule.forRoot(),
    RouterModule.forRoot(
      routes,
      {
        useHash: false,
        preloadingStrategy: IdlePreload,
        initialNavigation: 'enabled'
      }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule {}
