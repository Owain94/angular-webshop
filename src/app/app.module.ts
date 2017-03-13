import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { TransferHttpModule } from './modules/transfer-http/transfer-http.module';

import { AppComponent } from './app.component';
import { HomeViewComponent } from './home/home.component';

import { FactorialService } from './services/factorial.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TransferHttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeViewComponent,
        pathMatch: 'full'
      },
      {
        path: 'lazy',
        loadChildren: './+lazy/lazy.module#LazyModule'
      }
    ], {
      useHash: false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/'},
    FactorialService
  ],
  exports: [
    AppComponent
  ]
})
export class AppModule { }
