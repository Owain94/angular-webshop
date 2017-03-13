import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TransferHttpModule } from './modules/transfer-http/transfer-http.module';

import { AppComponent } from './app.component';

import { FactorialService } from './services/factorial.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TransferHttpModule,
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
