import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { BrowserTransferStateModule } from './modules/transfer-state/browser-transfer-state.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
        appId: 'cli-universal'
    }),
    BrowserTransferStateModule,
    AppModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppBrowserModule { }
