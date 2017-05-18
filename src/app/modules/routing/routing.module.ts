import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdlePreloadModule, IdlePreload } from './idle.preload.module';

import { HomeComponent } from '../../components/home/home.component';

import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: '../../components/profile/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: '../../components/profile/register/register.module#RegisterModule'
  },
  {
    path: 'products',
    loadChildren: '../../components/products/products.module#ProductsModule'
  },
  {
    path: 'cart',
    loadChildren: '../../components/cart/cart.module#CartModule'
  },
  {
    path: 'contact',
    loadChildren: '../../components/contact/contact.module#ContactModule'
  },
  {
    path: 'profile',
    loadChildren: '../../components/profile/profile.module#ProfileModule',
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'admin',
    loadChildren: '../../components/admin/admin.module#AdminModule',
    canActivate: [
      AdminGuard
    ],
    canLoad: [
      AdminGuard
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
