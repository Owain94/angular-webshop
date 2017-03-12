import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { FactorialService } from './services/factorial.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
        appId: 'cli-universal'
    }),
    FormsModule,
    HttpModule
  ],
  providers: [
    FactorialService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
