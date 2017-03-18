import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { BrowserTransferStateModule } from './transfer-state/browser-transfer-state.module';

import { MainComponent } from '../components/main/main.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
        appId: 'cli-universal'
    }),
    BrowserTransferStateModule,
    AppModule
  ],
  bootstrap: [
    MainComponent
  ]
})
export class AppBrowserModule {}
