import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { RoutingModule } from './routing/routing.module';
import { TransferHttpModule } from './transfer-http/transfer-http.module';

import { MainComponent } from '../components/main/main.component';
import { HomeViewComponent } from '../components/home/home.component';

@NgModule({
  declarations: [
    MainComponent,
    HomeViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TransferHttpModule,
    RoutingModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  exports: [
    MainComponent
  ]
})
export class AppModule { }
